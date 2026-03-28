package com.milestone.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.milestone.backend.dto.ChatMessage;
import com.milestone.backend.entity.User;
import com.milestone.backend.service.ChatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // Get chat history — returns DTO, not raw entity
    @GetMapping("/{matchId}")
    public List<ChatMessage> getChats(
            @PathVariable Long matchId,
            @AuthenticationPrincipal User user) {
        return chatService.getChat(matchId, user.getId());
    }

    // Send message — returns DTO, not raw entity
    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user) {

        String content = body.get("content");
        String matchIdStr = body.get("matchId");

        if (content == null || content.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        if (matchIdStr == null) {
            return ResponseEntity.badRequest().build();
        }

        Long matchId = Long.parseLong(matchIdStr);
        ChatMessage saved = chatService.sendMessage(matchId, user.getId(), content);
        return ResponseEntity.ok(saved);
    }
}
