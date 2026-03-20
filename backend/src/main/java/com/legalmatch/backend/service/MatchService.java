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
     * Generate matches for a case by comparing its category, location, and keywords
     * against Lawyer/NGO DirectoryProfiles.
     */
    public List<MatchResponse> generateMatches(Long caseId, String username) {
        Case legalCase = caseService.getCaseEntityById(caseId);

        // Verify the requesting user owns the case
        if (!legalCase.getUser().getEmail().equals(username)) {
            throw new RuntimeException("You can only generate matches for your own cases");
        }

        // Get all lawyer and NGO profiles
        List<DirectoryProfile> allProfiles = new ArrayList<>();
        allProfiles.addAll(profileRepository.findByUser_Role(Role.LAWYER));
        allProfiles.addAll(profileRepository.findByUser_Role(Role.NGO));

        List<MatchEntity> matches = new ArrayList<>();

        for (DirectoryProfile profile : allProfiles) {
            double score = calculateMatchScore(legalCase, profile);

            if (score > 0) {
                // Check if match already exists
                boolean alreadyExists = matchRepository.findByLegalCase(legalCase).stream()
                        .anyMatch(m -> m.getProvider().getId().equals(profile.getUser().getId()));

                if (!alreadyExists) {
                    MatchEntity match = MatchEntity.builder()
                            .legalCase(legalCase)
                            .citizen(legalCase.getUser())
                            .provider(profile.getUser())
                            .matchScore(score)
                            .status(MatchStatus.PENDING)
                            .build();

                    matches.add(matchRepository.save(match));

                    // Auto-trigger notification for the provider
                    notificationService.createNotification(
                            profile.getUser(),
                            "New Match",
                            "You have a new case match: " + legalCase.getCaseType(),
                            "NEW_MATCH"
                    );
                }
            }
        }

        // Update case status
        legalCase.setStatus(CaseStatus.MATCHED);

        return matches.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Calculate a match score (0-100) based on:
     *  - Category/Expertise overlap (50 points)
     *  - Location match (30 points)
     *  - Verified status bonus (20 points)
     */
    private double calculateMatchScore(Case legalCase, DirectoryProfile profile) {
        double score = 0;

        // Category matching: check if the case type is in the profile's expertise
        String caseType = legalCase.getCaseType() != null ? legalCase.getCaseType().toLowerCase() : "";
        String expertise = profile.getExpertise() != null ? profile.getExpertise().toLowerCase() : "";

        if (!caseType.isEmpty() && !expertise.isEmpty()) {
            if (expertise.contains(caseType) || caseType.contains(expertise)) {
                score += 50;
            } else {
                // Partial keyword match
                String[] caseWords = caseType.split("\\s+");
                for (String word : caseWords) {
                    if (word.length() > 2 && expertise.contains(word)) {
                        score += 25;
                        break;
                    }
                }
            }
        }

        // Location matching
        String caseLocation = legalCase.getLocation() != null ? legalCase.getLocation().toLowerCase().trim() : "";
        String profileLocation = profile.getLocation() != null ? profile.getLocation().toLowerCase().trim() : "";

        if (!caseLocation.isEmpty() && !profileLocation.isEmpty()) {
            if (caseLocation.equals(profileLocation)) {
                score += 30;
            } else if (profileLocation.contains(caseLocation) || caseLocation.contains(profileLocation)) {
                score += 15;
            }
        }

        // Verified bonus
        if (profile.isVerified()) {
            score += 20;
        }

        return Math.min(score, 100);
    }

    public List<MatchResponse> getMyMatches(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<MatchEntity> matches = matchRepository.findByCitizenOrProviderOrderByCreatedAtDesc(user, user);

        return matches.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public MatchResponse acceptMatch(Long matchId, String username) {
        MatchEntity match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        // Provider or citizen can accept
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!match.getProvider().getId().equals(user.getId()) &&
            !match.getCitizen().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to accept this match");
        }

        match.setStatus(MatchStatus.ACCEPTED);
        matchRepository.save(match);

        // Notify the other party
        User toNotify = match.getProvider().getId().equals(user.getId())
                ? match.getCitizen() : match.getProvider();
        notificationService.createNotification(
                toNotify,
                "Match Accepted",
                user.getName() + " accepted the match for case: " + match.getLegalCase().getCaseType(),
                "MATCH_ACCEPTED"
        );

        return mapToResponse(match);
    }

    public MatchResponse rejectMatch(Long matchId, String username) {
        MatchEntity match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!match.getProvider().getId().equals(user.getId()) &&
            !match.getCitizen().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to reject this match");
        }

        match.setStatus(MatchStatus.REJECTED);
        matchRepository.save(match);

        return mapToResponse(match);
    }

    private MatchResponse mapToResponse(MatchEntity match) {
        DirectoryProfile providerProfile = profileRepository.findByUser(match.getProvider())
                .orElse(null);

        return MatchResponse.builder()
                .id(match.getId())
                .caseId(match.getLegalCase().getId())
                .caseType(match.getLegalCase().getCaseType())
                .caseDescription(match.getLegalCase().getDescription())
                .caseLocation(match.getLegalCase().getLocation())
                .citizenId(match.getCitizen().getId())
                .citizenName(match.getCitizen().getName())
                .providerId(match.getProvider().getId())
                .providerName(match.getProvider().getName())
                .providerExpertise(providerProfile != null ? providerProfile.getExpertise() : "")
                .providerLocation(providerProfile != null ? providerProfile.getLocation() : "")
                .matchScore(match.getMatchScore())
                .status(match.getStatus().name())
                .createdAt(match.getCreatedAt())
                .build();
    }
}
