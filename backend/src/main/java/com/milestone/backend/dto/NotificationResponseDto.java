package com.milestone.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class NotificationResponseDto {
    private long id;
    private String title;
    private String message;
    private String type;
    private Long referenceId;
    private String referenceType;
    private String priority;
    private Boolean isRead;
    private LocalDateTime createdAt;
}