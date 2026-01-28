package com.securescape.dto;

import java.util.List;

public class AnalysisResult {
    
    private String language;
    private boolean hasVulnerabilities;
    private List<Vulnerability> vulnerabilities;
    private String message;

    public AnalysisResult() {}

    public AnalysisResult(String language, boolean hasVulnerabilities,
                          List<Vulnerability> vulnerabilities, String message) {
        
        this.language = language;
        this.hasVulnerabilities = hasVulnerabilities;
        this.vulnerabilities = vulnerabilities;
        this.message = message;
    }

    public String getLanguage() {
        return language;
    }
    public void setLanguage(String language) {
        this.language = language;
    }
    public boolean isHasVulnerabilities() {
        return hasVulnerabilities;
    }
    public void setHasVulnerabilities(boolean hasVulnerabilities) {
        this.hasVulnerabilities = hasVulnerabilities;
    }
    public List<Vulnerability> getVulnerabilities() {
        return vulnerabilities;
    }
    public void setVulnerabilities(List<Vulnerability> vulnerabilities) {
        this.vulnerabilities = vulnerabilities;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }

    public static class Vulnerability {
        
        private String type;
        private int line;
        private String description;
        private String severity;

        public Vulnerability() {}

        public Vulnerability(String type, int line, String description, String severity) {
            this.type = type;
            this.line = line;
            this.description = description;
            this.severity = severity;
        }
        public String getType() {
            return type;
        }
        public void setType(String type){
            this.type = type;
        }
        public int getLine() {
            return line;
        }
        public void setLine(int line){
            this.line = line;
        }
        public String getDescription() {
            return description;
        }
        public void setDescription(String description) {
            this.description = description;
        }
        public String getSeverity() {
            return severity;
        }
        public void setSeverity(String severity){
            this.severity = severity;
        }
        
    }
}