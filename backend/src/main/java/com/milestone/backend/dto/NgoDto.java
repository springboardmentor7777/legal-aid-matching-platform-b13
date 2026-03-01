package com.milestone.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NgoDto {
    private Long id;
    private String name; // The user's name (like a Point of Contact)
    private String email;
    private Boolean isVerified;
    private String location;
    // Pulled from NgoProfile
    private String organizationName;
    private String serviceArea;
}