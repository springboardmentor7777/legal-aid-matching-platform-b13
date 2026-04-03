package com.milestone.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
@Transactional
public class ChatService {

    private final ChatRepository chatRepo;
    private final MatchRepository matchRepo;
    private final UserRepository userRepo;
    private final NotificationService notificationService;

    public List<ChatMessage> getChat(Long matchId, Long userId) {

        Match match = matchRepo.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        if (match.getStatus() != MatchStatus.ACCEPTED) {
            throw new RuntimeException("Match is not accepted yet");
        }

        long citizenId = match.getCaseEntity().getUser().getId().longValue();
        long providerId = match.getUserId().longValue();
        long currentUserId = userId.longValue();

        if (citizenId != currentUserId && providerId != currentUserId) {
            throw new RuntimeException("User not allowed to access this chat");
        }

        return chatRepo.findByMatch_IdOrderByTimestampAsc(matchId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public ChatMessage sendMessage(Long matchId, Long senderId, String content) {

        Match match = matchRepo.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        if (match.getStatus() != MatchStatus.ACCEPTED) {
            throw new RuntimeException("Match is not accepted yet");
        }

        long citizenId = match.getCaseEntity().getUser().getId().longValue();
        long providerId = match.getUserId().longValue();
        long currentSenderId = senderId.longValue();

        if (citizenId != currentSenderId && providerId != currentSenderId) {
            throw new RuntimeException("User not allowed to send messages");
        }

        User sender = userRepo.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        Chat chat = new Chat();
        chat.setMatch(match);
        chat.setSender(sender);
        chat.setMessage(content);

        Chat savedChat = chatRepo.save(chat);

        User prov = userRepo.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));
        User cit = userRepo.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));

       if(citizenId == currentSenderId) {
            notificationService.createNotification(
                    prov,
                    "New message from citizen in your match",
                    chat.getMessage(),
                    "Message from: " + cit.getName(),
                    match.getCaseEntity().getId()
            );
        } else {
            notificationService.createNotification(
                    cit,
                    "New message from provider in your match",
                    chat.getMessage(),
                    "Message from: " + prov.getName(),
                    match.getCaseEntity().getId()
            );
        }
 

        return toDTO(savedChat);
    }

    private ChatMessage toDTO(Chat chat) {
        // notificationService.createNotification(
        //         chat.getMatch().getCaseEntity().getUser().getId(),
        //         "New message in your match",
        //         "/matches/" + chat.getMatch().getId()
        // );
        return new ChatMessage(
                chat.getId(),
                chat.getMatch().getId(),
                chat.getSender().getId(),
                chat.getMessage(),
                chat.getTimestamp()
        );
    }
}
