package com.legalmatch.backend.service;

import com.legalmatch.backend.entity.*;
import com.legalmatch.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    // ✅ SEND MESSAGE
    public MessageEntity sendMessage(Long matchId, String senderEmail, String content) {

        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        MatchEntity match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        // ✅ Allow only accepted matches
        if (match.getStatus() != MatchStatus.ACCEPTED) {
            throw new RuntimeException("Chat allowed only for accepted matches");
        }

        // ✅ Determine receiver
        User receiver = match.getProvider().getId().equals(sender.getId())
                ? match.getCitizen()
                : match.getProvider();

        MessageEntity message = MessageEntity.builder()
                .match(match)
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .build();

        return messageRepository.save(message);
    }

    // ✅ GET CHAT HISTORY (FIXED)
    public List<MessageEntity> getMessages(Long matchId) {

        MatchEntity match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        return messageRepository.findByMatchOrderByCreatedAtAsc(match);
    }
}