package com.legalmatch.backend.service;

import com.legalmatch.backend.entity.*;
import com.legalmatch.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Handles real-time and persisted messaging between matched citizens and providers.
 */
@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    /**
     * Sends a message within an accepted match conversation.
     * Automatically determines the receiver based on the sender's role in the match.
     *
     * @param matchId     the match conversation ID
     * @param senderEmail authenticated sender's email
     * @param content     message body
     * @return the persisted message entity
     */
    public MessageEntity sendMessage(Long matchId, String senderEmail, String content) {

        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        MatchEntity match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        if (match.getStatus() != MatchStatus.ACCEPTED) {
            throw new RuntimeException("Chat allowed only for accepted matches");
        }

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

    /**
     * Retrieves the full chat history for a match, ordered chronologically.
     *
     * @param matchId the match conversation ID
     * @return ordered list of messages
     */
    public List<MessageEntity> getMessages(Long matchId) {

        MatchEntity match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        return messageRepository.findByMatchOrderByCreatedAtAsc(match);
    }
}