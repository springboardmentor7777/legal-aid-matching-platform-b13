package com.legalmatch.backend.controller;

import com.legalmatch.backend.dto.MessageResponse;
import com.legalmatch.backend.entity.MessageEntity;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.UserRepository;
import com.legalmatch.backend.service.ChatService;
import com.legalmatch.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    // GET /api/chats/{matchId}
    @GetMapping("/{matchId}")
    public List<MessageResponse> getChat(@PathVariable Long matchId) {
        return chatService.getMessages(matchId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // POST /api/chats/send
    @PostMapping("/send")
    public MessageResponse sendMessage(
            @RequestParam Long matchId,
            @RequestParam String content,
            Authentication authentication
    ) {
        MessageEntity message = chatService.sendMessage(
                matchId,
                authentication.getName(),
                content
        );

        // Trigger notification for the receiver
        notificationService.createNotification(
                message.getReceiver(),
                "New Message",
                message.getSender().getUsername() + " sent you a message",
                "NEW_MESSAGE"
        );

        return mapToResponse(message);
    }

    private MessageResponse mapToResponse(MessageEntity m) {
        return MessageResponse.builder()
                .id(m.getId())
                .matchId(m.getMatch().getId())
                .senderId(m.getSender().getId())
                .senderName(m.getSender().getUsername())
                .receiverId(m.getReceiver().getId())
                .receiverName(m.getReceiver().getUsername())
                .content(m.getContent())
                .createdAt(m.getCreatedAt())
                .build();
    }
}