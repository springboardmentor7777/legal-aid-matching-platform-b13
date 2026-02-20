package com.teamthree.legalaid.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CaseDTO {
    private Long caseId;
    private String caseTitle;
    private String description;
    private String status;
    private LocalDateTime filingDate;
    private LocalDateTime hearingDate;
    private String clientName;
    private String lawyerName;
    private String ngoName;
}