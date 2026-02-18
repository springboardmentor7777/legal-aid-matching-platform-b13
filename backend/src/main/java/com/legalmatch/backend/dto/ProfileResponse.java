package com.legalmatch.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileResponse {

    private String name;
    private String email;
    private String role;
    private boolean enabled;
}
