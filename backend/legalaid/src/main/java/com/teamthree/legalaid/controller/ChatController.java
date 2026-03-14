package com.teamthree.legalaid.controller;

import com.teamthree.legalaid.entity.Message;
import com.teamthree.legalaid.service.ChatService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chats")
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(ChatService chatService,
                          SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping("/send")
    public Message sendMessage(@RequestBody Message message) {

        Message savedMessage = chatService.saveMessage(message);

        messagingTemplate.convertAndSend(
                "/topic/chat/" + message.getMatchId(),
                savedMessage
        );

        return savedMessage;
    }

    @GetMapping("/{matchId}")
    public List<Message> getChats(@PathVariable Long matchId) {
        return chatService.getChat(matchId);
    }
}