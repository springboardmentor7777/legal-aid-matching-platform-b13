package com.legalmatch.backend.dto;

import lombok.Data;

@Data
public class CreateCaseRequest {

    private String title;
    private String description;
    private String category;
}