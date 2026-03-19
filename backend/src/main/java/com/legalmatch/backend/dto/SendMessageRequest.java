package com.legalmatch.backend.dto;

import lombok.Data;

@Data
public class SendMessageRequest {

    private Long matchId;
    private String content;
}
