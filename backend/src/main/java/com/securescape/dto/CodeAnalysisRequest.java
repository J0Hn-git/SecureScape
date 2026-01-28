package com.securescape.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class CodeAnalysisRequest {

    @NotNull(message = "Language cannot be null")
    @NotBlank(message = "Language cannot be empty")
    @Pattern(regexp = "^(java|python|javascript)$",
             message = "Language must be one of java, python, javascript")
    
    private String language;

    @NotNull(message = "Code cannot be null")
    @NotBlank(message = "code cannot be empty")

    private String code;

    private String timestamp;

    public CodeAnalysisRequest() {}  // creating a constructor that makes an empty object.

    public CodeAnalysisRequest(String language, String code, String timestamp) {
        this.language = language;
        this.code = code;
        this.timestamp = timestamp;
    }
    public String getLanguage() {
        return language;
    }
    public String getCode() {
        return code;
    }
    public String getTimestamp() {
        return timestamp;
    }
    public void setLanguage(String language){
        this.language = language;
    }
    public void setCode(String code){
        this.code = code;
    }
    public void setTimestamp(String timestamp){
        this.timestamp = timestamp;
    }
    
}