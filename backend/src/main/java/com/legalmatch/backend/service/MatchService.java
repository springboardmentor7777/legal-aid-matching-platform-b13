package com.legalmatch.backend.service;

import com.legalmatch.backend.dto.MatchResponse;
import com.legalmatch.backend.entity.*;
import com.legalmatch.backend.repository.DirectoryProfileRepository;
import com.legalmatch.backend.repository.MatchRepository;
import com.legalmatch.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final CaseService caseService;
    private final DirectoryProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    /**
     * Generate matches for a case
     */
    public List<MatchResponse> generateMatches(Long caseId, String username) {

        Case legalCase = caseService.getCaseEntityById(caseId);

        // ✅ Security check
        if (!legalCase.getUser().getEmail().equals(username)) {
            throw new RuntimeException("You can only generate matches for your own cases");
        }

        // ✅ Fetch profiles
        List<DirectoryProfile> allProfiles = new ArrayList<>();
        allProfiles.addAll(profileRepository.findByUser_Role(Role.LAWYER));
        allProfiles.addAll(profileRepository.findByUser_Role(Role.NGO));

        // ✅ Fetch existing matches (optimization)
        List<MatchEntity> existingMatches = matchRepository.findByLegalCase(legalCase);

        List<MatchEntity> matches = new ArrayList<>();

        for (DirectoryProfile profile : allProfiles) {

            // ✅ Skip unavailable providers
            if (profile.getAvailability() != null && !profile.getAvailability()) continue;

            double score = calculateMatchScore(legalCase, profile);

            // ✅ Avoid weak matches
            if (score < 30) continue;

            // ✅ Prevent duplicates
            boolean alreadyExists = existingMatches.stream()
                    .anyMatch(m -> m.getProvider().getId().equals(profile.getUser().getId()));

            if (!alreadyExists) {

                MatchEntity match = MatchEntity.builder()
                        .legalCase(legalCase)
                        .citizen(legalCase.getUser())
                        .provider(profile.getUser())
                        .matchScore(score)
                        .status(MatchStatus.PENDING)
                        .build();

                MatchEntity savedMatch = matchRepository.save(match);
                matches.add(savedMatch);

                // 🔔 Notification
                notificationService.createNotification(
                        profile.getUser(),
                        "New Match",
                        "You have a new case match: " + legalCase.getCaseType(),
                        "NEW_MATCH"
                );
            }
        }

        // ✅ Update case status
        legalCase.setStatus(CaseStatus.MATCHED);
        caseService.save(legalCase);

        return matches.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Match scoring logic
     */
    private double calculateMatchScore(Case legalCase, DirectoryProfile profile) {

        double score = 0;

        String caseType = legalCase.getCaseType() != null
                ? legalCase.getCaseType().toLowerCase()
                : "";

        String expertise = profile.getExpertise() != null
                ? profile.getExpertise().toLowerCase()
                : "";

        // 🔥 Category match (50)
        if (!caseType.isEmpty() && !expertise.isEmpty()) {

            if (expertise.contains(caseType) || caseType.contains(expertise)) {
                score += 50;
            } else {
                String[] words = caseType.split("\\s+");
                for (String word : words) {
                    if (word.length() > 2 && expertise.contains(word)) {
                        score += 25;
                        break;
                    }
                }
            }
        }

        // 📍 Location match (30)
        String caseLocation = legalCase.getLocation() != null
                ? legalCase.getLocation().toLowerCase().trim()
                : "";

        String profileLocation = profile.getLocation() != null
                ? profile.getLocation().toLowerCase().trim()
                : "";

        if (!caseLocation.isEmpty() && !profileLocation.isEmpty()) {

            if (caseLocation.equals(profileLocation)) {
                score += 30;
            } else if (profileLocation.contains(caseLocation) || caseLocation.contains(profileLocation)) {
                score += 15;
            }
        }

        // ✅ Verified bonus (20)
        if (profile.isVerified()) {
            score += 20;
        }

        return Math.min(score, 100);
    }

    /**
     * Get matches for logged-in user
     */
    public List<MatchResponse> getMyMatches(String username) {

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<MatchEntity> matches =
                matchRepository.findByCitizenOrProviderOrderByCreatedAtDesc(user, user);

        return matches.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Accept match
     */
    public MatchResponse acceptMatch(Long matchId, String username) {

        MatchEntity match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!match.getProvider().getId().equals(user.getId()) &&
            !match.getCitizen().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized");
        }

        match.setStatus(MatchStatus.ACCEPTED);
        matchRepository.save(match);

        // 🔔 Notify other user
        User other = match.getProvider().getId().equals(user.getId())
                ? match.getCitizen()
                : match.getProvider();

        notificationService.createNotification(
                other,
                "Match Accepted",
                user.getUsername() + " accepted the match",
                "MATCH_ACCEPTED"
        );

        return mapToResponse(match);
    }

    /**
     * Reject match
     */
    public MatchResponse rejectMatch(Long matchId, String username) {

        MatchEntity match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!match.getProvider().getId().equals(user.getId()) &&
            !match.getCitizen().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized");
        }

        match.setStatus(MatchStatus.REJECTED);
        matchRepository.save(match);

        return mapToResponse(match);
    }

    /**
     * Convert entity → DTO
     */
    private MatchResponse mapToResponse(MatchEntity match) {

        DirectoryProfile profile =
                profileRepository.findByUser(match.getProvider()).orElse(null);

        return MatchResponse.builder()
                .id(match.getId())
                .caseId(match.getLegalCase().getId())
                .caseType(match.getLegalCase().getCaseType())
                .caseDescription(match.getLegalCase().getDescription())
                .caseLocation(match.getLegalCase().getLocation())
                .citizenId(match.getCitizen().getId())
                .citizenName(match.getCitizen().getUsername())
                .providerId(match.getProvider().getId())
                .providerName(match.getProvider().getUsername())
                .providerExpertise(profile != null ? profile.getExpertise() : "")
                .providerLocation(profile != null ? profile.getLocation() : "")
                .matchScore(match.getMatchScore())
                .status(match.getStatus().name())
                .createdAt(match.getCreatedAt())
                .build();
    }
}