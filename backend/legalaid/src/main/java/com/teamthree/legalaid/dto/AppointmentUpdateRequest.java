package com.teamthree.legalaid.dto;

import jakarta.validation.constraints.Future;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentUpdateRequest {

    @Future(message = "scheduledTime must be a future date/time")
    private LocalDateTime scheduledTime;

    private Integer durationMinutes;

    private String notes;

    // Only CONFIRMED or CANCELLED allowed from client
    private String status;
}