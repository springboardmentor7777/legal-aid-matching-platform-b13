package com.teamthree.legalaid.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsOverviewDTO {
    private Long totalUsers;
    private Long totalLawyers;
    private Long totalNgos;
    private Long totalAdmins;
    private Long totalCases;
    private Long matchedCases;
    private Long resolvedCases;
    private Long activeCases;
    private Long pendingCases;
    private Long totalMatches;
    private Long activeAppointments;
    private Long totalMessages;
    private Long totalAppointments;
}
