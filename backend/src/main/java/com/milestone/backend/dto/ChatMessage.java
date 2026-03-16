package com.milestone.backend.dto;

import lombok.Data;

@Data
public class ChatMessage {

    private Long matchId;
    private Long senderId;
    private String content;

}