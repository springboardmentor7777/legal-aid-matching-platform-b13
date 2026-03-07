package com.teamthree.legalaid.dto;

import com.teamthree.legalaid.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private Role role;

    // Lawyer-specific fields
    private Integer experienceYears;
    private String specialization;
    private String location;
}