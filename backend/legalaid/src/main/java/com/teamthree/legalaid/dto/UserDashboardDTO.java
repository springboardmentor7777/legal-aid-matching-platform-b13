package com.teamthree.legalaid.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDashboardDTO {
    private Long userId;
    private String fullName;
    private String email;
    private Long totalCases;
    private Long activeCases;
    private Long resolvedCases;
    private String assignedLawyerName;
    private List<RecentCaseDTO> recentCases;
    private List<ActivityDTO> recentActivities;
}