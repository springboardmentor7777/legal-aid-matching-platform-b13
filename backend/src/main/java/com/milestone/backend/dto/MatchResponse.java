package com.milestone.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor // Added for better compatibility with JSON mapping
public class MatchResponse {
    private Long matchId;
    private String status;
    private Integer score;   // <--- Added this to make it visible in JSON

    // Case details
    private Long caseId;
    private String caseTitle;

    // Provider details
    private Long providerId;
    private String providerName;
    private String providerRole;

    // Profile details
    private String specialization;   // for lawyers
    private Integer experience;      // for lawyers
    private String location;         // for lawyers
    private String serviceArea;      // for NGOs
}