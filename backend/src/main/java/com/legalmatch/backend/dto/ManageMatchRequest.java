package com.legalmatch.backend.dto;

import lombok.Data;

@Data
public class ManageMatchRequest {
    private String internalStatus;
    private String providerNotes;
}
