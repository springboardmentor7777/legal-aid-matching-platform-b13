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
public class MatchAnalyticsDTO {
    private Long totalMatches;
    private Long lawyerMatches;
    private Long ngoMatches;
    private Map<String, Long> byStatus;             // PENDING, ACCEPTED, REJECTED
    private List<TrendPointDTO> matchesOverTime;     // monthly match trend
}
