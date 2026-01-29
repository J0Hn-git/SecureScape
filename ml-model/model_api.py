from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import os
import subprocess
import tempfile
import json
import re


app = Flask(__name__)
CORS(app)


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def _normalize_vuln_type(rule_id: str, message: str) -> str:
    """Normalize Semgrep rule IDs to common vulnerability types."""
    rule_lower = rule_id.lower()
    msg_lower = message.lower()
    
    if "sql" in rule_lower or "sql" in msg_lower or "injection" in rule_lower:
        return "SQL_INJECTION"
    elif "xss" in rule_lower or "xss" in msg_lower or "cross-site" in msg_lower:
        return "XSS"
    elif "csrf" in rule_lower or "csrf" in msg_lower:
        return "CSRF"
    elif "command" in rule_lower or "command" in msg_lower or "shell" in rule_lower:
        return "COMMAND_INJECTION"
    elif "path" in rule_lower and "traversal" in msg_lower:
        return "PATH_TRAVERSAL"
    elif "xxe" in rule_lower:
        return "XXE"
    elif "ssrf" in rule_lower:
        return "SSRF"
    elif "deserialization" in rule_lower:
        return "UNSAFE_DESERIALIZATION"
    else:
        return rule_id.replace("-", "_").upper()


def _generate_fix(code: str, language: str, vuln: dict) -> str:
    """Generate fixed code based on vulnerability type and location."""
    lines = code.split("\n")
    line_num = vuln.get("line", 1) - 1
    vuln_type = vuln.get("type", "").upper()
    
    if line_num < 0 or line_num >= len(lines):
        return code
    
    original_line = lines[line_num]
    fixed_line = original_line
    
    if "SQL_INJECTION" in vuln_type:
        if language == "java":
            fixed_line = re.sub(r'\+\s*\w+\s*\+', ' + ? + ', original_line)
            if "?" in fixed_line and "PreparedStatement" not in "\n".join(lines[:line_num]):
                lines.insert(max(0, line_num - 1), "// Use PreparedStatement with parameterized query")
        
        elif language == "python":
            fixed_line = re.sub(r"f?['\"](.*?WHERE.*?=.*?)\{(\w+)\}(.*?)['\"]", r'"\1?\3"', original_line)
            if fixed_line == original_line:
                fixed_line = re.sub(r"['\"]\s*\+\s*\w+\s*\+\s*['\"]", "?", original_line)
        
        elif language == "javascript":
            fixed_line = re.sub(r"`(.*?WHERE.*?=.*?)\$\{(\w+)\}(.*?)`", r'`\1?\3`', original_line)
            if fixed_line == original_line:
                fixed_line = re.sub(r"['\"]\s*\+\s*\w+\s*\+\s*['\"]", "?", original_line)
    
    elif "XSS" in vuln_type:
        if language == "java":
            # More comprehensive Java XSS fix
            if "println(" in original_line or "print(" in original_line:
                # Extract the content between parentheses
                match = re.search(r'print(ln)?\((.*)\)', original_line)
                if match:
                    content = match.group(2)
                    # Check if it contains concatenation with variables
                    if '+' in content:
                        # Wrap variables in escapeHtml
                        fixed_content = re.sub(r'\+\s*(\w+)\s*\+', r'+ org.springframework.web.util.HtmlUtils.htmlEscape(\1) +', content)
                        fixed_line = original_line.replace(content, fixed_content)
                        # Add import if not present
                        if "HtmlUtils" not in "\n".join(lines[:5]):
                            lines.insert(0, "import org.springframework.web.util.HtmlUtils;")
        
        elif language == "javascript":
            if "innerHTML" in original_line:
                fixed_line = original_line.replace("innerHTML", "textContent")
                comment = "// Use textContent instead of innerHTML to prevent XSS"
                if comment not in "\n".join(lines[max(0, line_num-2):line_num]):
                    lines.insert(max(0, line_num), comment)
            elif "document.write(" in original_line:
                # Replace document.write with safe alternative
                match = re.search(r'document\.write\((.*?)\)', original_line)
                if match:
                    content = match.group(1)
                    safe_version = f"document.getElementById('output').textContent = {content}"
                    fixed_line = original_line.replace(f"document.write({content})", safe_version)
    
    elif "COMMAND_INJECTION" in vuln_type:
        if language == "python":
            if "os.system(" in original_line:
                fixed_line = original_line.replace("os.system(", "# FIXED: Use subprocess.run with list\n# subprocess.run(['safe_command'], check=True)  # os.system(")
            elif "subprocess" in original_line and "shell=True" in original_line:
                fixed_line = original_line.replace("shell=True", "shell=False  # Fixed: Use list of args instead")
    
    lines[line_num] = fixed_line
    return "\n".join(lines)


def _apply_all_fixes(code: str, language: str, vulns: list) -> str:
    """Apply all fixes to the code."""
    fixed_code = code
    sorted_vulns = sorted(vulns, key=lambda x: x.get("line", 1), reverse=True)
    
    for vuln in sorted_vulns:
        try:
            fixed_code = _generate_fix(fixed_code, language, vuln)
        except Exception as e:
            logger.warning(f"Failed to generate fix: {e}")
            continue
    
    return fixed_code


def _pattern_based_detection(code: str, language: str) -> list:
    """Fallback pattern matching for common vulnerabilities."""
    vulns = []
    lines = code.split("\n")
    
    for i, line in enumerate(lines, 1):
        # SQL Injection patterns
        if re.search(r'["\']\s*\+\s*\w+.*?(SELECT|INSERT|UPDATE|DELETE)', line, re.IGNORECASE):
            vulns.append({
                "type": "SQL_INJECTION",
                "line": i,
                "description": "Potential SQL injection: String concatenation in SQL query",
                "severity": "HIGH",
                "rule_id": "pattern-sql-injection"
            })
        
        # XSS patterns
        if language == "javascript":
            if "innerHTML" in line and "=" in line:
                vulns.append({
                    "type": "XSS",
                    "line": i,
                    "description": "Potential XSS: Using innerHTML with user input",
                    "severity": "HIGH",
                    "rule_id": "pattern-xss-innerhtml"
                })
            elif "document.write(" in line:
                vulns.append({
                    "type": "XSS",
                    "line": i,
                    "description": "Potential XSS: Using document.write with user input",
                    "severity": "MEDIUM",
                    "rule_id": "pattern-xss-document-write"
                })
            elif "eval(" in line:
                vulns.append({
                    "type": "CODE_INJECTION",
                    "line": i,
                    "description": "Dangerous use of eval() function",
                    "severity": "HIGH",
                    "rule_id": "pattern-eval-injection"
                })
        
        elif language == "java":
            if re.search(r'out\.print(ln)?\s*\(.*?\+', line):
                vulns.append({
                    "type": "XSS",
                    "line": i,
                    "description": "Potential XSS: Unescaped output to response",
                    "severity": "MEDIUM",
                    "rule_id": "pattern-xss-output"
                })
        
        # Command Injection patterns
        if language == "python":
            if "os.system(" in line:
                vulns.append({
                    "type": "COMMAND_INJECTION",
                    "line": i,
                    "description": "Potential command injection: Using os.system with user input",
                    "severity": "HIGH",
                    "rule_id": "pattern-command-injection-os"
                })
            elif "subprocess.call(" in line or ("subprocess" in line and "shell=True" in line):
                vulns.append({
                    "type": "COMMAND_INJECTION",
                    "line": i,
                    "description": "Potential command injection: Using subprocess with shell=True",
                    "severity": "HIGH",
                    "rule_id": "pattern-command-injection-subprocess"
                })
            if "yaml.load(" in line and "Loader" not in line:
                vulns.append({
                    "type": "UNSAFE_DESERIALIZATION",
                    "line": i,
                    "description": "Unsafe YAML deserialization without safe loader",
                    "severity": "HIGH",
                    "rule_id": "pattern-yaml-unsafe"
                })
    
    return vulns


def _run_semgrep(code: str, language: str) -> dict:
    """Run Semgrep analysis with fallback pattern matching."""
    semgrep_bin = os.getenv("SEMGREP_BIN", "semgrep")
    ruleset = "p/owasp-top-ten"
    
    ext_map = {"java": "java", "python": "py", "javascript": "js"}
    ext = ext_map.get(language)
    if not ext:
        raise ValueError(f"Unsupported language: {language}")
    
    vulns = []
    
    # Try Semgrep first
    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            file_path = os.path.join(tmpdir, f"code.{ext}")
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(code or "")
            
            cmd = [semgrep_bin, "--quiet", "--json", "--config", ruleset, file_path]
            logger.info(f"Running Semgrep: {' '.join(cmd)}")
            proc = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            logger.info(f"Semgrep return code: {proc.returncode}")
            
            if proc.returncode in (0, 1):
                data = json.loads(proc.stdout or "{}")
                for res in data.get("results", []):
                    extra = res.get("extra", {})
                    start = res.get("start", {})
                    line_num = start.get("line", 1)
                    rule_id = extra.get("message") or extra.get("check_id") or "UNKNOWN"
                    message = extra.get("message", "Security issue detected")
                    severity = (extra.get("severity") or "INFO").upper()
                    vuln_type = _normalize_vuln_type(rule_id, message)
                    
                    vulns.append({
                        "type": vuln_type,
                        "line": line_num,
                        "description": message,
                        "severity": severity,
                        "rule_id": rule_id,
                    })
                    
                logger.info(f"Semgrep found {len(vulns)} vulnerabilities")
    except Exception as e:
        logger.warning(f"Semgrep analysis failed: {e}")
    
    # Fallback: Pattern-based detection if Semgrep found nothing
    if not vulns:
        logger.info("Using pattern-based fallback detection")
        vulns = _pattern_based_detection(code, language)
        logger.info(f"Pattern matching found {len(vulns)} vulnerabilities")
    
    vulns.sort(key=lambda x: x["line"])
    fixed_code = _apply_all_fixes(code, language, vulns) if vulns else code
    
    return {
        "language": language,
        "hasVulnerabilities": bool(vulns),
        "vulnerabilities": vulns,
        "fixedCode": fixed_code,
        "message": f"Analysis completed: {len(vulns)} vulnerability/vulnerabilities found" if vulns else "No vulnerabilities detected",
    }


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
        
        logger.info(f"Analyzing {language} code")
        result = _run_semgrep(code, language)
        return jsonify(result), 200
    
    except Exception as e:
        logger.exception("Analysis error")
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ML Model API is running"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
