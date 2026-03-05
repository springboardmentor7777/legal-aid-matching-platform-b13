package com.legalmatch.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DirectoryProfileResponse {

    private Long id;
    private String name;
    private String organizationName;
    private String expertise;
    private String location;
    private boolean verified;
}