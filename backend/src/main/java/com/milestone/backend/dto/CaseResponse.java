package com.milestone.backend.dto;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CaseResponse {

    private Long id;
    private String title;
    private String description;
    private String category;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String location;
    private String incidentDate;
    private String incidentTime;
    private String additionalNotes;
    private String contactInfo;
    private String attachment;

    // --- NEW FIELDS FOR 3-LEVEL FORM ---
    private String personName;
    private String customCategory;
    private String subcategory;
    private String currentStatus;
    private String firNumber;
    private String firFile;
    private String otherLocation;
    private String otherRepresentative;
    private String legalDocuments;
}