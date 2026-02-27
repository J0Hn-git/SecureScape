from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import os
import re
import joblib

from security_features import SecurityFeatureExtractor, CombinedFeatureTransformer

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------- MODEL LOADING ----------

MODEL_PATH = r"C:\projects\SecureScape\ml-model\models_ensemble\ensemble_model (1).joblib"
transformer, ensemble, le = joblib.load(MODEL_PATH)

# ---------- LINE-LEVEL PATTERNS ----------

XSS_LINE_PATTERNS = [
    (r'innerHTML', "Untrusted data written to innerHTML (DOM XSS sink)"),
    (r'outerHTML', "Untrusted data written to outerHTML (DOM XSS sink)"),
    (r'document\.write', "Untrusted data written with document.write (DOM XSS sink)"),
    (r'eval\s*\(', "Use of eval with potentially untrusted input"),
    (r'insertAdjacentHTML', "Untrusted HTML inserted with insertAdjacentHTML"),
    (r'res\.send\s*\(.*<', "HTML response built with res.send and unescaped data"),
]

CSRF_LINE_PATTERNS = [
    (r'app\.post\(', "State-changing POST route may be missing CSRF protection"),
    (r'router\.post\(', "Router POST handler may be missing CSRF protection"),
    (r'requests\.post\s*\(', "Server-side POST request can be CSRF target if tied to cookies"),
    (r'axios\.post\s*\(', "Axios POST call may be missing CSRF token"),
    (r'\$\.post\s*\(', "jQuery POST call may be missing CSRF token"),
]

def _find_xss_lines(code: str):
    vulns = []
    for i, raw in enumerate(code.split("\n"), start=1):
        line = raw.strip()
        if line.startswith("//") or line.startswith("#"):
            continue
        for pattern, reason in XSS_LINE_PATTERNS:
            if re.search(pattern, line):
                vulns.append({
                    "type": "XSS",
                    "line": i,
                    "description": reason,
                    "rule_id": f"pattern:{pattern}",
                })
                break
    return vulns

def _find_csrf_lines(code: str):
    vulns = []
    for i, raw in enumerate(code.split("\n"), start=1):
        line = raw.strip()
        if line.startswith("//") or line.startswith("#"):
            continue
        for pattern, reason in CSRF_LINE_PATTERNS:
            if re.search(pattern, line):
                vulns.append({
                    "type": "CSRF",
                    "line": i,
                    "description": reason,
                    "rule_id": f"pattern:{pattern}",
                })
                break
    return vulns

# ---------- ENSEMBLE PREDICTION ----------

def predict_ensemble(code_snippet: str):
    X = [code_snippet]
    X_f = transformer.transform(X)
    proba = ensemble.predict_proba(X_f)[0]
    idx = int(proba.argmax())
    label = le.inverse_transform([idx])[0]      # "XSS", "CSRF", "Clean"
    scores = {cls: float(p) * 100.0 for cls, p in zip(le.classes_, proba)}
    confidence = scores[label]
    return label, confidence, scores

# ---------- AUTO-FIX LOGIC (unchanged) ----------

def _generate_fix(code: str, language: str, vuln: dict) -> str:
    lines = code.split("\n")
    line_num = vuln.get("line", 1) - 1
    vuln_type = vuln.get("type", "").upper()

    if line_num < 0 or line_num >= len(lines):
        return code

    original_line = lines[line_num]
    fixed_line = original_line

    # SQL Injection fixes (unchanged)
    if "SQL_INJECTION" in vuln_type:
        if language == "java":
            fixed_line = re.sub(r'\+\s*\w+\s*\+', ' + ? + ', original_line)
            if "?" in fixed_line and "PreparedStatement" not in "\n".join(lines[:line_num]):
                lines.insert(max(0, line_num - 1), "// Use PreparedStatement with parameterized query")

        elif language == "python":
            fixed_line = re.sub(
                r"f?['\"](.*?WHERE.*?=.*?)\{(\w+)\}(.*?)['\"]",
                r'"\1?\3"', original_line
            )
            if fixed_line == original_line:
                fixed_line = re.sub(
                    r"['\"]\s*\+\s*\w+\s*\+\s*['\"]",
                    "?", original_line
                )

        elif language == "javascript":
            fixed_line = re.sub(
                r"`(.*?WHERE.*?=.*?)\$\{(\w+)\}(.*?)`",
                r'`\1?\3`', original_line
            )
            if fixed_line == original_line:
                fixed_line = re.sub(
                    r"['\"]\s*\+\\s*\w+\s*\+\s*['\"]",
                    "?", original_line
                )

    # XSS fixes (unchanged but now use real line numbers)
    elif "XSS" in vuln_type:
        if language == "java":
            if "println(" in original_line or "print(" in original_line:
                match = re.search(r'print(ln)?\((.*)\)', original_line)
                if match:
                    content = match.group(2)
                    if '+' in content:
                        fixed_content = re.sub(
                            r'\+\s*(\w+)\s*\+',
                            r'+ org.springframework.web.util.HtmlUtils.htmlEscape(\1) +',
                            content
                        )
                        fixed_line = original_line.replace(content, fixed_content)

                        if "HtmlUtils" not in "\n".join(lines[:5]):
                            lines.insert(0, "import org.springframework.web.util.HtmlUtils;")

        elif language == "javascript":
            if "innerHTML" in original_line:
                fixed_line = original_line.replace("innerHTML", "textContent")
                comment = "// Use textContent instead of innerHTML to prevent XSS"
                if comment not in "\n".join(lines[max(0, line_num - 2):line_num]):
                    lines.insert(max(0, line_num), comment)
            elif "document.write(" in original_line:
                match = re.search(r'document\.write\((.*?)\)', original_line)
                if match:
                    content = match.group(1)
                    safe_version = f"document.getElementById('output').textContent = {content}"
                    fixed_line = original_line.replace(f"document.write({content})", safe_version)

    # Command injection fixes (unchanged)
    elif "COMMAND_INJECTION" in vuln_type:
        if language == "python":
            if "os.system(" in original_line:
                fixed_line = original_line.replace(
                    "os.system(",
                    "# FIXED: Use subprocess.run with list\n# subprocess.run(['safe_command'], check=True)  # os.system("
                )
            elif "subprocess" in original_line and "shell=True" in original_line:
                fixed_line = original_line.replace(
                    "shell=True",
                    "shell=False  # Fixed: Use list of args instead"
                )

    lines[line_num] = fixed_line
    return "\n".join(lines)

def _apply_all_fixes(code: str, language: str, vulns: list) -> str:
    fixed_code = code
    sorted_vulns = sorted(vulns, key=lambda x: x.get("line", 1), reverse=True)

    for vuln in sorted_vulns:
        try:
            fixed_code = _generate_fix(fixed_code, language, vuln)
        except Exception as e:
            logger.warning(f"Failed to generate fix: {e}")
            continue

    return fixed_code

# ---------- MAIN ANALYSIS PIPELINE ----------

def _analyze_with_ensemble(code: str, language: str) -> dict:
    """
    Use the ensemble model as the primary analyzer.
    We then adjust the final label using regex patterns so that
    clear CSRF/XSS patterns override the model when appropriate.
    """
    label, confidence, scores = predict_ensemble(code)       # "XSS" / "CSRF" / "Clean"
    scores = {k: float(v) for k, v in scores.items()}        # make sure plain floats
    xss_lines = _find_xss_lines(code)
    csrf_lines = _find_csrf_lines(code)

    # ---- label arbitration: force CSRF when patterns hit ----
    final_label = label.lower()

    if csrf_lines and scores.get("CSRF", 0.0) >= 10.0 and scores.get("CSRF", 0.0) >= scores.get("XSS", 0.0):
        final_label = "csrf"
    elif xss_lines and scores.get("XSS", 0.0) >= scores.get("CSRF", 0.0):
        final_label = "xss"
    # else keep whatever the model said (including "clean")

    vulns = []

    if final_label == "xss":
        line_vulns = xss_lines
        if line_vulns:
            for v in line_vulns:
                v.update({
                    "severity": "HIGH" if confidence > 80 else "MEDIUM",
                    "confidence": round(confidence, 1),
                    "scores": scores,
                    "source": "ensemble+patterns",
                })
            vulns.extend(line_vulns)
        else:
            vulns.append({
                "type": "XSS",
                "line": 1,
                "description": f"Ensemble model predicted XSS with {confidence:.1f}% confidence.",
                "severity": "HIGH" if confidence > 80 else "MEDIUM",
                "rule_id": "ensemble-model",
                "confidence": round(confidence, 1),
                "scores": scores,
            })

    elif final_label == "csrf":
        line_vulns = csrf_lines
        if line_vulns:
            for v in line_vulns:
                v.update({
                    "severity": "HIGH" if confidence > 80 else "MEDIUM",
                    "confidence": round(confidence, 1),
                    "scores": scores,
                    "source": "ensemble+patterns",
                })
            vulns.extend(line_vulns)
        else:
            vulns.append({
                "type": "CSRF",
                "line": 1,
                "description": f"Ensemble model predicted CSRF with {confidence:.1f}% confidence.",
                "severity": "HIGH" if confidence > 80 else "MEDIUM",
                "rule_id": "ensemble-model",
                "confidence": round(confidence, 1),
                "scores": scores,
            })

    fixed_code = _apply_all_fixes(code, language, vulns) if vulns else code

    return {
        "language": language,
        "hasVulnerabilities": bool(vulns),
        "vulnerabilities": vulns,
        "fixedCode": fixed_code,
        "message": (
            f"Analysis completed: {len(vulns)} vulnerability/vulnerabilities found"
            if vulns else "No vulnerabilities detected"
        ),
    }

# ---------- FLASK ROUTES ----------

@app.route("/api/analyze", methods=["POST"])
def analyze_code():
    try:
        data = request.get_json() or {}
        language = data.get("language")
        code = data.get("code", "")

        if not language or not code:
            return jsonify({"error": "Both 'language' and 'code' must be provided"}), 400

        if language not in ("java", "python", "javascript"):
            return jsonify({"error": "Unsupported language"}), 400

        logger.info(f"Analyzing {language} code with ensemble model")
        result = _analyze_with_ensemble(code, language)
        return jsonify(result), 200

    except Exception as e:
        logger.exception("Analysis error")
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ML Model API is running"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
