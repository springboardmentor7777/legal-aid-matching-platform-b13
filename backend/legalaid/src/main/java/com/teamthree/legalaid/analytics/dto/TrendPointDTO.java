package com.teamthree.legalaid.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrendPointDTO {
    private String period;   // e.g. "2025-01", "2025-01-15"
    private Long count;
}
