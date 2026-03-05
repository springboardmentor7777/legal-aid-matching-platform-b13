package com.milestone.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@AllArgsConstructor
public class ProfileResponseDto {

    private Long id;
    private String name;
    private String email;
    private String role; 
    // Lawyer fields
    private String specialization;
    private Integer experience;
    private String location;

    // NGO fields
    private String organizationName;
    private String serviceArea;

    private boolean isVerified;
}
