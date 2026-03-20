package com.milestone.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
@Transactional
public class ChatService {

    private final ChatRepository chatRepo;
    private final MatchRepository matchRepo;
    private final UserRepository userRepo;

    public List<Chat> getChat(Long matchId, Long userId) {

        Match match = matchRepo.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        if (match.getStatus() != MatchStatus.ACCEPTED) {
            throw new RuntimeException("Match is not accepted yet");
        }

        //  FIXED: Safer ID comparison
        long citizenId = match.getCaseEntity().getUser().getId().longValue();
        long providerId = match.getUserId().longValue();
        long currentUserId = userId.longValue();

        if (citizenId != currentUserId && providerId != currentUserId) {
            throw new RuntimeException("User not allowed to access this chat");
        }

        return chatRepo.findByMatch_IdOrderByTimestampAsc(matchId);
    }

    public Chat sendMessage(Long matchId, Long senderId, String content) {
        
        System.out.println("🚀 --- INCOMING CHAT MESSAGE ---");
        System.out.println("Match ID: " + matchId);
        System.out.println("Sender ID Attempting to Send: " + senderId);

        Match match = matchRepo.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        if (match.getStatus() != MatchStatus.ACCEPTED) {
            System.out.println("❌ FAILED: Match is not ACCEPTED. Current status: " + match.getStatus());
            throw new RuntimeException("Match is not accepted yet");
        }

        long citizenId = match.getCaseEntity().getUser().getId().longValue();
        long providerId = match.getUserId().longValue();
        long currentSenderId = senderId.longValue();

        System.out.println("Citizen ID for this Match: " + citizenId);
        System.out.println("Provider ID for this Match: " + providerId);

        //  FIXED: Safer ID comparison
        if (citizenId != currentSenderId && providerId != currentSenderId) {
            System.out.println("❌ FAILED: Sender ID does not match Citizen or Provider!");
            throw new RuntimeException("User not allowed to send messages");
        }

        User sender = userRepo.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        Chat chat = new Chat();
        chat.setMatch(match);
        chat.setSender(sender);
        chat.setMessage(content);

        Chat savedChat = chatRepo.save(chat);
        System.out.println("✅ SUCCESS: Message saved to database!");
        
        return savedChat;
    }
}