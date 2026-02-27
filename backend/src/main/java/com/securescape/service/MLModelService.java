package com.securescape.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.securescape.dto.AnalysisResult;
import com.securescape.dto.CodeAnalysisRequest;

@Service
public class MLModelService {

    // Base URL of Flask ensemble API (e.g. http://localhost:5000)
    @Value("${ml.model.base.url:http://localhost:5000}")
    private String mlModelBaseUrl;

    private final RestTemplate restTemplate;

    public MLModelService() {
        this.restTemplate = new RestTemplate();
    }

    public AnalysisResult analyzeWithModel(CodeAnalysisRequest request) {
        String endpoint = mlModelBaseUrl + "/api/analyze";

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // send the full request (code + language) to Flask
            HttpEntity<CodeAnalysisRequest> entity = new HttpEntity<>(request, headers);

            ResponseEntity<AnalysisResult> response = restTemplate.exchange(
                endpoint,
                HttpMethod.POST,
                entity,
                AnalysisResult.class
            );

            AnalysisResult result = response.getBody();
            if (result == null) {
                throw new RuntimeException("Empty response from ML model");
            }

            return result;

        } catch (RestClientException e) {
            throw new RuntimeException("Failed to communicate with ML model: " + e.getMessage(), e);
        }
    }
}
