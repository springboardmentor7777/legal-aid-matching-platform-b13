package com.milestone.backend.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @Size(min = 2, message = "Name must be at least 2 characters")
    private String name;

    private String phone;

    private String address;
}
