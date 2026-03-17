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
    private String callDuration;
    private Boolean reminder;
    private String zone;
    private String selectedTime;

    public AppointmentResponseDto(Long id, 
        Long matchId, 
        String status, 
        String message, 
        String appointmentDate, 
        String appointementTime, 
        String notes,
        String duration,
        String zone,
        String selectedTime 
    ) {
        this.id = id;
        this.matchId = matchId;
        this.status = status;
        this.message = message;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointementTime;
        this.zone = zone;
        this.selectedTime = selectedTime;
        this.callDuration = duration;
    }
}