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
public class CaseAnalyticsDTO {
    private Long totalCases;
    private Long activeCases;
    private Long resolvedCases;
    private Long pendingCases;
    private Long matchedCases;
    private Map<String, Long> byCategory;         // category -> count (bar chart)
    private Map<String, Long> byStatus;            // status -> count
    private List<TrendPointDTO> newCasesOverTime;  // monthly case filing trend
    private List<LocationCountDTO> byLocation;     // city -> case count (map)
}
