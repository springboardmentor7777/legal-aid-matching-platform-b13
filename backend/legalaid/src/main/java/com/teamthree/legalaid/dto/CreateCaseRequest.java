package com.teamthree.legalaid.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class CreateCaseRequest {

    @NotBlank(message = "Title is required")
    private String caseTitle;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Location is required")
    private String location;

    // Extended fields
    private String keywords;
    private String dateTime;
    private String contactInfo;

    // Other Party
    private String otherPartyName;
    private String otherPartyLocation;
    private String otherPartyContact;
    private String otherPartyRepresentative;

    // Criminal
    private String investigatingOfficer;
    private String witnesses;

    // Status
    private String currentStatus;

    // Evidence
    private String firNumber;
    private String firDocument;
    private String firDocumentName;
    private List<String> caseDocuments;
    private List<String> caseDocumentNames;
}