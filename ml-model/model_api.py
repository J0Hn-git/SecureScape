from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/api/analyze', methods=['POST'])
def analyze_code():
    try:
        data = request.get_json()
        
        language = data.get('language')
        code = data.get('code')
        timestamp = data.get('timestamp')
        
        logger.info(f"Analyzing {language} code")
        
        if language == 'java':
            result = analyze_java(code)
        elif language == 'python':
            result = analyze_python(code)
        elif language == 'javascript':
            result = analyze_javascript(code)
        else:
            return jsonify({"error": 'Unsupported language'}), 400
        
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        return jsonify({"error": str(e)}), 500

def analyze_java(code):
    # Mock analysis for Java code
    return {
        'language': 'java',
        'hasVulnerabilities': True,
        'vulnerabilities': [
            {
                'type': 'SQL_INJECTION',
                'line': 1,
                'description': 'Potential SQL injection vulnerability',
                'severity': 'HIGH'
            }
        ],
        'message': 'Analysis completed for Java code'
    }

def analyze_python(code):
    # Mock analysis for Python code
    return {
        'language': 'python',
        'hasVulnerabilities': True,
        'vulnerabilities': [
            {
                'type': 'COMMAND_INJECTION',
                'line': 1,
                'description': 'Potential command injection vulnerability',
                'severity': 'HIGH'
            }
        ],
        'message': 'Analysis completed for Python code'
    }

def analyze_javascript(code):
    # Mock analysis for JavaScript code
    return {
        'language': 'javascript',
        'hasVulnerabilities': True,
        'vulnerabilities': [
            {
                'type': 'XSS',
                'line': 1,
                'description': 'Potential XSS vulnerability in user input handling',
                'severity': 'MEDIUM'
            }
        ],
        'message': 'Analysis completed for JavaScript code'
    }

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ML Model API is running'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
