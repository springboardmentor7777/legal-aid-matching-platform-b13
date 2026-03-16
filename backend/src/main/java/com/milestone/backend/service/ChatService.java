package com.milestone.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import com.milestone.backend.dto.ChatMessage;
import com.milestone.backend.entity.Chat;
import com.milestone.backend.entity.Match;
import com.milestone.backend.entity.MatchStatus;
import com.milestone.backend.entity.User;
import com.milestone.backend.repository.ChatRepository;
import com.milestone.backend.repository.MatchRepository;
import com.milestone.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepo;
    private final MatchRepository matchRepo;
    private final UserRepository userRepo;

    // Get chat messages
    public List<Chat> getChat(Long matchId, Long userId) {

        // Find match and ensure it is accepted
        Match match = matchRepo.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        if (match.getStatus() != MatchStatus.ACCEPTED) {
            throw new RuntimeException("Match is not accepted yet");
        }

        // Access control: only matched user or case owner
        if (!match.getUserId().equals(userId) &&
            !match.getCaseEntity().getUser().getId().equals(userId)) {
            throw new RuntimeException("User not allowed to access this chat");
        }

        return chatRepo.findByMatch_IdOrderByTimestampAsc(matchId);
    }

    // Send message
    public Chat sendMessage(Long matchId, Long senderId, String content) {

        // Validate match
        Match match = matchRepo.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        if (match.getStatus() != MatchStatus.ACCEPTED) {
            throw new RuntimeException("Match is not accepted yet");
        }

        // Access control
        if (!match.getUserId().equals(senderId) &&
            !match.getCaseEntity().getUser().getId().equals(senderId)) {
            throw new RuntimeException("User not allowed to send messages");
        }

        // Find sender User
        User sender = userRepo.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        // Create new chat message
        Chat chat = new Chat();
        chat.setMatch(match);
        chat.setSender(sender);
        chat.setMessage(content);

        return chatRepo.save(chat);
    }
}