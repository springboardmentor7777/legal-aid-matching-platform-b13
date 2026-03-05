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
    private String role;       // fixed: was Integer roleId returning ordinal (0,1,2,3) — now returns "USER", "LAWYER" etc.
    private String provider;
    private LocalDateTime createdAt;
}