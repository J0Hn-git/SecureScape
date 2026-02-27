import re
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy.sparse import hstack, csr_matrix


class SecurityFeatureExtractor(BaseEstimator, TransformerMixin):
    XSS_PATTERNS = [
        r'\.innerHTML\s*[+=]',   r'\.outerHTML\s*[+=]',
        r'document\.write\s*\(', r'insertAdjacentHTML',
        r'eval\s*\(',            r'setTimeout\s*\([\'"]',
        r'\.html\s*\([^)]*\)',   r'location\.(hash|search|href)',
        r'window\.name',         r'req\.query\.',
        r'req\.body\.',          r'request\.args',
        r'request\.form\[',      r'request\.GET',
        r'request\.POST',        r'res\.send\s*\(',
        r'res\.write\s*\(',      r'HttpResponse\s*\(',
        r'render_template_string', r'Template\s*\(',
        r'setAttribute.*onclick',
    ]

    CSRF_PATTERNS = [
        r'credentials.*include|include.*credentials',
        r'withCredentials.*true',   r'method.*POST|POST.*method',
        r'\.submit\s*\(',           r'type.*hidden|hidden.*type',
        r'requests\.post\s*\(',     r'axios\.post\s*\(',
        r'XMLHttpRequest',          r'methods=.*POST',
        r'db\.session\.commit',     r'\.delete\s*\(',
        r'\.destroy\s*\(',          r'findByIdAndDelete',
        r'\.update\s*\(',           r'balance\s*-=',
        r'\$\.post\s*\(',
    ]

    SAFE_PATTERNS = [
        r'DOMPurify',               r'textContent\s*[=+]',
        r'createTextNode',          r'escapeHtml',
        r'markupsafe',              r'bleach\.clean',
        r'csrf_protect',            r'CSRFProtect',
        r'csrfProtection',          r'verifyCsrfToken',
        r'X-CSRF-Token',            r'csrf_token',
        r'validator\.escape',       r'\.prepare\s*\(',
        r'escape\s*\(',             r'conditional_escape',
        r'format_html',             r'validate_csrf',
        r'helmet\s*\(',             r'ALLOWED_TAGS',
    ]

    def _count(self, code, patterns):
        return sum(len(re.findall(p, code, re.IGNORECASE)) for p in patterns)

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        features = []
        for code in X:
            n = max(len(code.split('\n')), 1)

            x = self._count(code, self.XSS_PATTERNS)
            c = self._count(code, self.CSRF_PATTERNS)
            s = self._count(code, self.SAFE_PATTERNS)

            features.append([
                x, c, s,                 # raw counts
                x / n, c / n, s / n,     # per-line normalized
                n,                       # number of lines
                max(x - s, 0), max(c - s, 0),
                int(x > 0 and s == 0),
                int(c > 0 and s == 0),
                int(bool(re.search(r'innerHTML|outerHTML', code))),
                int(bool(re.search(r'eval\s*\(', code))),
                int(bool(re.search(r'document\.write', code))),
                int(bool(re.search(r'credentials.*include|withCredentials', code))),
                int(bool(re.search(r'render_template_string|Template\s*\(', code))),
                int(bool(re.search(r'setAttribute.*onclick', code))),
                int(bool(re.search(r'balance\s*-=', code))),
                int(x > c and x > s),
                int(c > x and c > s),
                int(s > x and s > c),
            ])
        return np.array(features)


class CombinedFeatureTransformer(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.tfidf = TfidfVectorizer(
            analyzer='word',
            token_pattern=r'[a-zA-Z_][a-zA-Z0-9_.]*|[^\w\s]',
            ngram_range=(1, 3),
            max_features=5000,
            sublinear_tf=True,
            min_df=1,
        )
        self.sec = SecurityFeatureExtractor()

    def fit(self, X, y=None):
        self.tfidf.fit(X)
        return self

    def transform(self, X):
        return hstack([
            self.tfidf.transform(X),
            csr_matrix(self.sec.transform(X)),
        ])
