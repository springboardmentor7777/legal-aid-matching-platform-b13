package com.milestone.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LawyerDto {
    private Long id;
    private String name;
    private String email;
    private Boolean isVerified;
    
    private String specialization; 
    private Integer experience;
    private String location; 

    private Boolean isAvailable;
}