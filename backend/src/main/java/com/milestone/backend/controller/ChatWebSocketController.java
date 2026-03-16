package com.milestone.backend.controller;

import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.milestone.backend.entity.Chat;
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

        // Sender ID is from server-side session/authentication in production
        Chat message = chatService.sendMessage(
                chatMessage.getMatchId(),
                chatMessage.getSenderId(),
                chatMessage.getContent());

        // Broadcast to all subscribers of this match
        messagingTemplate.convertAndSend(
                "/topic/match/" + chatMessage.getMatchId(),
                message);
    }
}