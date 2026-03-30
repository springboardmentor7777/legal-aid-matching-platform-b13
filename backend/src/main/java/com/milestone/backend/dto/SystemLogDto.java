package com.milestone.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
public class SystemLogDto {
    private String timestamp;
    private String level;
    private String message;
}