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

        // 1. Save to Database )
        Chat savedChat = chatService.sendMessage(
                chatMessage.getMatchId(),
                chatMessage.getSenderId(),
                chatMessage.getContent());

        // 2.  FIXED: Broadcast the clean DTO instead of the raw Database Entity
        ChatMessage responseDto = new ChatMessage();
        responseDto.setMatchId(chatMessage.getMatchId());
        responseDto.setSenderId(chatMessage.getSenderId());
        responseDto.setContent(chatMessage.getContent());

        // 3. Send back to React
        messagingTemplate.convertAndSend(
                "/topic/match/" + chatMessage.getMatchId(),
                responseDto);
    }
}