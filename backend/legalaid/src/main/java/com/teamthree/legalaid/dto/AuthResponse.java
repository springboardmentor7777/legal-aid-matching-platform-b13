package com.teamthree.legalaid.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {

    private String status;
    private String message;

    private String accessToken;
    private String refreshToken;

    private String role;
    private String userId;
}