package com.legalmatch.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AppointmentResponse {

    private Long id;
    private Long matchId;
    private String title;
    private String description;
    private LocalDateTime appointmentDate;
    private String location;
    private String status;
    private Long createdById;
    private String createdByName;
    private String citizenName;
    private String providerName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
