package com.milestone.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class AppointmentResponseDto {
    private Long id;
    private Long matchId;
    private String status;
    private String message;

    private String appointmentDate; 
    private String appointmentTime; 
    private String notes;

    public AppointmentResponseDto(Long id, Long matchId, String status, String message) {
        this.id = id;
        this.matchId = matchId;
        this.status = status;
        this.message = message;
    }
}