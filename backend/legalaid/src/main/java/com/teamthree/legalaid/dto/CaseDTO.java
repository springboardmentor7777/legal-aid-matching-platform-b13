package com.teamthree.legalaid.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CaseDTO {

    // --- Core fields (used by CaseController / CaseService) ---
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

    // --- Extended fields (used by dashboard services) ---
    private Long caseId;        // alias for id — used by Lawyer/Ngo/User dashboard mappers
    private String caseTitle;   // alias for title — used by Lawyer/Ngo/User dashboard mappers
    private String clientName;  // name of the citizen who filed the case
    private String lawyerName;  // name of the assigned lawyer
    private String ngoName;     // name of the assigned NGO
}