package com.teamthree.legalaid.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CaseDTO {

    // Core fields
    private Long id;
    private Long userId;
    private String title;
    private String description;
    private String category;
    private String location;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime filingDate;
    private LocalDateTime hearingDate;
    private String userName;
    private String userEmail;

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

    // Aliases used by dashboard services
    private Long caseId;
    private String caseTitle;
    private String clientName;
    private String lawyerName;
    private String ngoName;
}