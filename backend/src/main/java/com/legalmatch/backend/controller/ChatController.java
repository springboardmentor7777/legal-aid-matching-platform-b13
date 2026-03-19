package com.legalmatch.backend.controller;

import com.legalmatch.backend.dto.SendMessageRequest;
import com.legalmatch.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(
            @RequestBody SendMessageRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(
                chatService.sendMessage(request, authentication.getName())
        );
    }

    @GetMapping("/{matchId}")
    public ResponseEntity<?> getChatHistory(
            @PathVariable Long matchId,
            Authentication authentication) {
        return ResponseEntity.ok(
                chatService.getChatHistory(matchId, authentication.getName())
        );
    }
}
