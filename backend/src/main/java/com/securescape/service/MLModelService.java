package com.securescape.service;

import com.securescape.dto.CodeAnalysisRequest;
import com.securescape.dto.AnalysisResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;
import org.springframework.http.*;


@Service
public class MLModelService {

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

            HttpEntity<CodeAnalysisRequest> entity = new HttpEntity<>(request, headers);

            ResponseEntity<AnalysisResult> response = restTemplate.exchange(
                endpoint,
                HttpMethod.POST,
                entity,
                AnalysisResult.class
            );
            return response.getBody();

        } catch (RestClientException e){
            throw new RuntimeException("Failed to communicate with ML model : " + e.getMessage(), e);
        }
    }


}