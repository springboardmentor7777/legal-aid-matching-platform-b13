package com.legalmatch.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MatchResponse {

    private Long id;
    private Long caseId;
    private String caseType;
    private String caseDescription;
    private String caseLocation;
    private Long citizenId;
    private String citizenName;
    private Long providerId;
    private String providerName;
    private String providerExpertise;
    private String providerLocation;
    private double matchScore;
    private String status;
    private LocalDateTime createdAt;
}
