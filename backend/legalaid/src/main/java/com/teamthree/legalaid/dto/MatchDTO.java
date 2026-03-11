package com.teamthree.legalaid.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchDTO {
    private Long id;
    private Long caseId;
    private String caseTitle;
    private String caseCategory;
    private String caseLocation;
    private Long profileId;
    private String profileType; 
    private String profileName;
    private String profileExpertise;
    private String profileLocation;
    private Boolean profileVerified;
    private Integer experienceYears; 
    private Integer matchScore;
    private String status;
    private LocalDateTime matchDate;
    private LocalDateTime createdAt;
}