package com.securescape.controller;

import com.securescape.dto.CodeAnalysisRequest;
import com.securescape.dto.AnalysisResult;
import com.securescape.service.MLModelService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
@Validated
public class AnalysisController {

    private static final Logger logger = LoggerFactory.getLogger(AnalysisController.class);

    @Autowired
    private MLModelService mlModelService;

    @PostMapping("/analyze")
    public ResponseEntity<AnalysisResult> analyzeCode(
            @Valid @RequestBody CodeAnalysisRequest request) {
        
        logger.info("Received analysis request for language: {}", request.getLanguage());
        
        try {
            AnalysisResult result = mlModelService.analyzeWithModel(request);
            logger.info("Analysis completed successfully");
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            logger.error("Analysis failed", e);

            // Instead of propagating the exception (which results in a generic 500),
            // return a structured error payload so the frontend can handle it gracefully.
            AnalysisResult fallback = new AnalysisResult(
                    request.getLanguage(),
                    false,
                    Collections.emptyList(),
                    "Failed to analyze code: " + e.getMessage(),
                    request.getCode()  // Return original code if analysis fails
            );

            // 502 Bad Gateway is appropriate when a downstream service (ML model) failed.
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(fallback);
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Spring Boot Gateway is running");
    }
}
