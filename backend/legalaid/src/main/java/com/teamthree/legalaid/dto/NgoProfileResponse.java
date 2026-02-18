package com.teamthree.legalaid.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NgoProfileResponse {
    
	private Long id;
    private Long userId;
    private String organizationName;
    private String registrationNumber;
    
   
}