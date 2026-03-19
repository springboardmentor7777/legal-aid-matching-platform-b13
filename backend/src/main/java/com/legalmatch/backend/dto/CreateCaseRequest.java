package com.legalmatch.backend.dto;

import lombok.Data;

@Data
public class CreateCaseRequest {

    private String caseType;
    private String description;
    private String urgency;
    private String location;
}