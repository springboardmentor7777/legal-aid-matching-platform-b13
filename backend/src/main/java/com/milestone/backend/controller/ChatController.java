package com.milestone.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.milestone.backend.entity.Chat;
import com.milestone.backend.entity.User;
import com.milestone.backend.service.ChatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // Get chat history
    @GetMapping("/{matchId}")
    public List<Chat> getChats(@PathVariable Long matchId, @AuthenticationPrincipal User user) {
        Long userId = user.getId();
        return chatService.getChat(matchId, userId);
    }

    // Send message
    @PostMapping("/send")
    public Chat sendMessage(@RequestBody Map<String, String> body, @AuthenticationPrincipal User user) {
        Long userId = user.getId();

        Long matchId = Long.parseLong(body.get("matchId"));
        String content = body.get("content");

        if (content == null || content.isEmpty()) {
            throw new IllegalArgumentException("Message content cannot be empty");
        }

        return chatService.sendMessage(matchId, userId, content);
    }
}