package com.teamthree.legalaid.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    
	private Long id;
    private String fullName;
    private String email;
    private Integer roleId;
    private String provider;
    private LocalDateTime createdAt;
    
 
}