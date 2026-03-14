package com.milestone.backend.dto;

import lombok.Data;

@Data
public class AppointmentRequestDto {
    private Long matchId;
    private String appointmentDate; 
    private String appointmentTime; 
    private String notes;
}