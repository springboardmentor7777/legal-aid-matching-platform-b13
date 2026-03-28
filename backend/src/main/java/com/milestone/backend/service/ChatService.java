package com.milestone.backend.controller;

import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.milestone.backend.service.ChatService;
import com.milestone.backend.dto.ChatMessage;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage chatMessage) {

        // 1. Save to DB and get back the DTO (includes id + timestamp from DB)
        ChatMessage savedDto = chatService.sendMessage(
                chatMessage.getMatchId(),
                chatMessage.getSenderId(),
                chatMessage.getContent());

        // 2. Broadcast the saved DTO — use the one returned from the service
        //    so the frontend gets the real DB-generated id and timestamp
        messagingTemplate.convertAndSend(
                "/topic/match/" + savedDto.getMatchId(),
                savedDto);
    }
}
