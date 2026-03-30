package com.milestone.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
public class SystemHealthDto {
    private String status;
    private String database;
    private String server;
}