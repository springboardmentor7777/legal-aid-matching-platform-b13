package com.teamthree.legalaid.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

import com.teamthree.legalaid.dto.CaseDTO;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LawyerDashboardDTO {
    private Long lawyerId;
    private String fullName;
    private String specialization;
    private Integer experienceYears;
    private Boolean isAvailable;
    private Long assignedCases;
    private Long completedCases;
    private Long pendingCases;
    private List<CaseDTO> todaySchedule;  // Changed to List<CaseDTO>
    private List<CaseDTO> recentCases;
}