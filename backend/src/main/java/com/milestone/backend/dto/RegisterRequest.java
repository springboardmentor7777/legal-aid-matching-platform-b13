package com.milestone.backend.dto;

import com.milestone.backend.entity.Role;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.*;

@Data
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotNull(message = "Role is required")
    private Role role;
}
