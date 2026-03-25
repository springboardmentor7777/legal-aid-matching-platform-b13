package com.teamthree.legalaid.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityAnalyticsDTO {
    private Long totalAppointments;
    private Long activeAppointments;
    private Long completedAppointments;
    private Long totalMessages;
    private Long activeChats;          // distinct conversation pairs
    private List<TrendPointDTO> appointmentsOverTime;
    private List<TrendPointDTO> messagesOverTime;
}
