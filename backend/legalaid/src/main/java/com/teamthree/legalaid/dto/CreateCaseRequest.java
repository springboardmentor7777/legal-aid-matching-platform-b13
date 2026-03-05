package com.teamthree.legalaid.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateCaseRequest {
    
    @NotBlank(message = "Title is required")
    private String caseTitle;  // This should be caseTitle, not title
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Location is required")
    private String location;
}