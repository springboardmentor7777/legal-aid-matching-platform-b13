package com.milestone.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class NotificationResponseDto {
    private long id;
    private String message;
    private Boolean isRead;
}
