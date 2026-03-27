package com.milestone.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExternalNGOResponseDto {
    private Long id;
    private String name;
    private String email;
    private String experience;
    private String isVerified;
    private String organizationName;
    private String serviceLocation;
}
