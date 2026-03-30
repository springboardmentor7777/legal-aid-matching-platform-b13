package com.milestone.backend.dto;

import com.milestone.backend.entity.Role;
import lombok.*;

@Data
@AllArgsConstructor
public class UserResponseDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private Boolean isVerified;
    private Boolean enabled;
}