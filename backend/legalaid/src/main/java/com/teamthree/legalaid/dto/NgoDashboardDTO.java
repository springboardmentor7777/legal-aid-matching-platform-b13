package com.teamthree.legalaid.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NgoDashboardDTO {
    private Long ngoId;
    private String organizationName;
    private String registrationNumber;
    private Long totalCases;
    private Long activeCases;
    private Long resolvedCases;
    private Long assignedLawyers;
    private List<CaseDTO> assignedCases;
    private List<LawyerDTO> availableLawyers;
}