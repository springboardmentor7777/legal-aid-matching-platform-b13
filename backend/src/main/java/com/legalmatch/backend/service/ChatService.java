package com.legalmatch.backend.service;

import com.legalmatch.backend.dto.MessageResponse;
import com.legalmatch.backend.dto.SendMessageRequest;
import com.legalmatch.backend.entity.MatchEntity;
import com.legalmatch.backend.entity.MessageEntity;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.MatchRepository;
import com.legalmatch.backend.repository.MessageRepository;
import com.legalmatch.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public MessageResponse sendMessage(SendMessageRequest request, String username) {
        User sender = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        MatchEntity match = matchRepository.findById(request.getMatchId())
                .orElseThrow(() -> new RuntimeException("Match not found"));

        // Determine receiver: the other party in the match
        User receiver;
        if (match.getCitizen().getId().equals(sender.getId())) {
            receiver = match.getProvider();
        } else if (match.getProvider().getId().equals(sender.getId())) {
            receiver = match.getCitizen();
        } else {
            throw new RuntimeException("You are not a participant in this match");
        }

        MessageEntity message = MessageEntity.builder()
                .match(match)
                .sender(sender)
                .receiver(receiver)
                .content(request.getContent())
                .build();

        MessageEntity saved = messageRepository.save(message);

        // Auto-trigger notification for receiver
        notificationService.createNotification(
                receiver,
                "New Message",
                sender.getUsername() + " sent you a message",
                "NEW_MESSAGE"
        );

        return mapToResponse(saved);
    }

    public List<MessageResponse> getChatHistory(Long matchId, String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        MatchEntity match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        // Verify user is a participant
        if (!match.getCitizen().getId().equals(user.getId()) &&
            !match.getProvider().getId().equals(user.getId())) {
            throw new RuntimeException("You are not a participant in this match");
        }

        List<MessageEntity> messages = messageRepository.findByMatchOrderByTimestampAsc(match);

        return messages.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private MessageResponse mapToResponse(MessageEntity msg) {
        return MessageResponse.builder()
                .id(msg.getId())
                .matchId(msg.getMatch().getId())
                .senderId(msg.getSender().getId())
                .senderName(msg.getSender().getUsername())
                .receiverId(msg.getReceiver().getId())
                .receiverName(msg.getReceiver().getUsername())
                .content(msg.getContent())
                .timestamp(msg.getTimestamp())
                .build();
    }
}
