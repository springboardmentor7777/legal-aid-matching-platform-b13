package com.milestone.backend.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CaseRequest {
    // Level 1: Basic Info
    private String title;
    private String personName;
    private String contactInfo;
    
    // Level 2: Categorization & Details
    private String category;
    private String customCategory;
    private String subcategory;
    private String description;
    private String additionalNotes;
    private String currentStatus;
    
    // Level 3: Incident Details & Files
    private String firNumber; 
    private String firFile; 
    private String incidentDate;
    private String incidentTime;
    private String location;
    private String otherLocation;
    private String otherRepresentative;
    private String attachment;
    private String legalDocuments;
}