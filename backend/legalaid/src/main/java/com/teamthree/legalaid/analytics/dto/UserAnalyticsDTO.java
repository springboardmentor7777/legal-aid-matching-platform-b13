package com.teamthree.legalaid.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAnalyticsDTO {
    private Long totalUsers;
    private Long totalLawyers;
    private Long totalNgos;
    private Long totalCitizens;
    private Long totalAdmins;
    private Map<String, Long> byRole;            // role -> count  (for pie chart)
    private List<TrendPointDTO> newUsersOverTime; // monthly registration trend
}
