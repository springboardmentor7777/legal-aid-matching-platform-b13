package com.legalmatch.backend.controller;

import com.legalmatch.backend.dto.ChatMessageRequest;
import com.legalmatch.backend.dto.MessageResponse;
import com.legalmatch.backend.entity.MessageEntity;
import com.legalmatch.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    // ✅ WebSocket endpoint: /app/chat.sendMessage
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessageRequest request) {

        // 🔹 Save message in DB
        MessageEntity saved = chatService.sendMessage(
                request.getMatchId(),
                request.getSenderEmail(),   // from frontend (or JWT later)
                request.getContent()
        );

        // 🔹 Convert to response DTO
        MessageResponse response = MessageResponse.builder()
                .id(saved.getId())
                .matchId(saved.getMatch().getId())
                .senderId(saved.getSender().getId())
                .senderName(saved.getSender().getUsername())
                .receiverId(saved.getReceiver().getId())
                .receiverName(saved.getReceiver().getUsername())
                .content(saved.getContent())
                .createdAt(saved.getCreatedAt())
                .build();

        // 🔥 Broadcast to all subscribers of this match
        messagingTemplate.convertAndSend(
                "/topic/chat/" + request.getMatchId(),
                response
        );
    }
}