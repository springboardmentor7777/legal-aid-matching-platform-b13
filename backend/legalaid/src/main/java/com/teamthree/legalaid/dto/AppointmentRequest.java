package com.teamthree.legalaid.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentRequest {

    @NotNull(message = "matchId is required")
    private Long matchId;

    @NotNull(message = "scheduled 	ime is required")
    @Future(message = "scheduledTime must be a future date/time")
    private LocalDateTime scheduledTime;

    private Integer durationMinutes; 

    private String notes;
}