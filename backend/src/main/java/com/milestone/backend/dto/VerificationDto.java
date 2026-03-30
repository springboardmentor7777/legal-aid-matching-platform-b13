package com.milestone.backend.dto;

import com.milestone.backend.entity.Role;
import lombok.*;

@Data
@AllArgsConstructor
public class VerificationDto {
    private Long id;
    private String name;
    private Role role;
    private Boolean isVerified;
}