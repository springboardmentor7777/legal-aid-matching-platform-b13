package com.legalmatch.backend.dto;

import lombok.Data;

@Data
public class ChatMessageRequest {

    private Long matchId;
    private String senderEmail;
    private String content;
}