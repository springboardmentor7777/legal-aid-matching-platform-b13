package com.milestone.backend.dto;

import com.milestone.backend.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {

    private Long id; //  ADDED THIS LINE!
    
    private String accessToken;
    private String refreshToken;
    private String message;
    private Role role;
    private String username;
    private String email;
    private Boolean isVerified;

}