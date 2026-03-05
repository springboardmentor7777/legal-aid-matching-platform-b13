package com.milestone.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class VerificationRequest {
    
    private String email;
    
    @JsonProperty("is_verified")
    private boolean isVerified; 
}