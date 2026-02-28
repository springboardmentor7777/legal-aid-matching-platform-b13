package com.milestone.backend.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String name;
    
    // Lawyer specific fields
    private String specialization;
    private Integer experience;
    private String location;
    
    // NGO specific fields
    private String organizationName;
    private String serviceArea;
}