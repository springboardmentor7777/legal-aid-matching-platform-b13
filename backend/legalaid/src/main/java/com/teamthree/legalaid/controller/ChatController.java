package com.teamthree.legalaid.controller;

import com.teamthree.legalaid.entity.Message;
import com.teamthree.legalaid.repository.UserRepository;
import com.teamthree.legalaid.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    // POST /chats/send
    // /chats/** is permitAll in SecurityConfig — no @PreAuthorize conflict
    // senderId is overridden from JWT so client cannot spoof it
    @PostMapping("/send")
    public Message sendMessage(
            @RequestBody Message message,
            @AuthenticationPrincipal UserDetails principal) {

        // Override senderId from JWT token — ignore whatever the client sent
        if (principal != null) {
            userRepository.findByEmail(principal.getUsername())
                    .ifPresent(user -> message.setSenderId(user.getId()));
        }

        Message saved = chatService.saveMessage(message);

        messagingTemplate.convertAndSend("/topic/chat/" + message.getMatchId(), saved);

        return saved;
    }

    // GET /chats/{matchId}
    @GetMapping("/{matchId}")
    public List<Message> getChats(@PathVariable Long matchId) {
        return chatService.getChat(matchId);
    }
}