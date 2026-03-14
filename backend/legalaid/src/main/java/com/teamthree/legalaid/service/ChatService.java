package com.teamthree.legalaid.service;

import com.teamthree.legalaid.entity.Message;
import com.teamthree.legalaid.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    private final MessageRepository messageRepository;

    public ChatService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public Message saveMessage(Message message) {
        message.setTimestamp(LocalDateTime.now());
        return messageRepository.save(message);
    }

    public List<Message> getChat(Long matchId) {
        return messageRepository.findByMatchId(matchId);
    }
}