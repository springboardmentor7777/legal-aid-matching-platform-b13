package com.teamthree.legalaid.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LawyerProfileResponse {
    
    private Long id;
    private Long userId;
    private String specialization;
    private Integer experienceYears;
}