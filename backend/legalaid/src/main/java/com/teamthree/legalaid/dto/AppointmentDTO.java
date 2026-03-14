package com.teamthree.legalaid.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AppointmentDTO {

    private Long id;

    private Long matchId;
    private String profileType;   
    private String profileName;   
    private String profileExpertise;

    private Long userId;
    private String userName;

    private LocalDateTime scheduledTime;
    private Integer durationMinutes;
    private String notes;
    private String status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}