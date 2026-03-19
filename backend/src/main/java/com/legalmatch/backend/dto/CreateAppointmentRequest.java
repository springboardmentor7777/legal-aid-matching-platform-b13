package com.legalmatch.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateAppointmentRequest {

    private Long matchId;
    private String title;
    private String description;
    private LocalDateTime appointmentDate;
    private String location;
}
