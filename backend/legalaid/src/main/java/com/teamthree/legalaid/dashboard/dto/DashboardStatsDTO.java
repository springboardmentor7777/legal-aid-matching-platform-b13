package com.teamthree.legalaid.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
	
	private Long totalUsers;
    private Long totalLawyers;
    private Long totalNgos;
    private Long totalCases;
    private Long activeCases;
    private Long resolvedCases;
    private Long pendingCases;
	
}
