package com.legalmatch.backend.service;

import com.legalmatch.backend.dto.MatchResponse;
import com.legalmatch.backend.entity.*;
import com.legalmatch.backend.repository.*;
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
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private final LawyerProfileRepository lawyerRepository;
    private final NGOProfileRepository ngoRepository;

    /**
     * Generate matches for a case
     */
    public List<MatchResponse> generateMatches(Long caseId, String username) {

        Case legalCase = caseService.getCaseEntityById(caseId);

        // ✅ Security check
        if (!legalCase.getUser().getEmail().equals(username)) {
            throw new RuntimeException("You can only generate matches for your own cases");
        }

        List<MatchEntity> existingMatches = matchRepository.findByLegalCase(legalCase);
        List<MatchEntity> newMatches = new ArrayList<>();

        // =========================
        // 🔹 LAWYER MATCHING
        // =========================
        List<LawyerProfile> lawyers = lawyerRepository.findAll();

        for (LawyerProfile lp : lawyers) {

            double score = calculateLawyerScore(legalCase, lp);
            if (score < 10) continue;

            boolean alreadyExists = existingMatches.stream()
                    .anyMatch(m -> m.getProvider().getId().equals(lp.getUser().getId()));

            if (!alreadyExists) {

                MatchEntity match = MatchEntity.builder()
                        .legalCase(legalCase)
                        .citizen(legalCase.getUser())
                        .provider(lp.getUser())
                        .matchScore(score)
                        .status(MatchStatus.PENDING)
                        .build();

                MatchEntity saved = matchRepository.save(match);
                newMatches.add(saved);

                notificationService.createNotification(
                        lp.getUser(),
                        "New Match",
                        "You have a new case match: " + legalCase.getCaseType(),
                        "NEW_MATCH"
                );
            }
        }

        // =========================
        // 🔹 NGO MATCHING
        // =========================
        List<NGOProfile> ngos = ngoRepository.findAll();

        for (NGOProfile np : ngos) {

            double score = calculateNGOScore(legalCase, np);
            if (score < 10) continue;

            boolean alreadyExists = existingMatches.stream()
                    .anyMatch(m -> m.getProvider().getId().equals(np.getUser().getId()));

            if (!alreadyExists) {

                MatchEntity match = MatchEntity.builder()
                        .legalCase(legalCase)
                        .citizen(legalCase.getUser())
                        .provider(np.getUser())
                        .matchScore(score)
                        .status(MatchStatus.PENDING)
                        .build();

                MatchEntity saved = matchRepository.save(match);
                newMatches.add(saved);

                notificationService.createNotification(
                        np.getUser(),
                        "New Match",
                        "You have a new case match: " + legalCase.getCaseType(),
                        "NEW_MATCH"
                );
            }
        }

        // ✅ Update case status ONLY if matches found
        if (!newMatches.isEmpty()) {
            legalCase.setStatus(CaseStatus.MATCHED);
            caseService.save(legalCase);
        }

        // ✅ Return all matches (existing + new)
        List<MatchEntity> allMatches = matchRepository.findByLegalCase(legalCase);

        return allMatches.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * 🔹 Lawyer scoring
     */
    private double calculateLawyerScore(Case legalCase, LawyerProfile lp) {

        double score = 0;

        String caseType = safeLower(legalCase.getCaseType());
        String expertise = safeLower(lp.getExpertise());

        if (expertise.contains(caseType) || caseType.contains(expertise)) {
            score += 40;
        }

        if (matchLocation(legalCase.getLocation(), lp.getLocation())) {
            score += 30;
        }

        if (Boolean.TRUE.equals(lp.getVerified())) {
            score += 20;
        }

        return score;
    }

    /**
     * 🔹 NGO scoring
     */
    private double calculateNGOScore(Case legalCase, NGOProfile np) {

        double score = 0;

        if (matchLocation(legalCase.getLocation(), np.getLocation())) {
            score += 40;
        }

        String caseType = safeLower(legalCase.getCaseType());
        String focus = safeLower(np.getFocusArea());

        if (caseType.contains(focus) || focus.contains(caseType)) {
            score += 30;
        }

        if (Boolean.TRUE.equals(np.getVerified())) {
            score += 20;
        }

        return score;
    }

    /**
     * 🔹 Utility: safe lowercase
     */
    private String safeLower(String value) {
        return value != null ? value.toLowerCase() : "";
    }

    /**
     * 🔹 Utility: location match
     */
    private boolean matchLocation(String loc1, String loc2) {
        if (loc1 == null || loc2 == null) return false;

        String a = loc1.toLowerCase();
        String b = loc2.toLowerCase();

        return a.contains(b) || b.contains(a);
    }

    /**
     * Get matches for logged-in user
     */
    public List<MatchResponse> getMyMatches(String username) {

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return matchRepository
                .findByCitizenOrProviderOrderByCreatedAtDesc(user, user)
                .stream()
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

        if (!isAuthorized(match, user)) {
            throw new RuntimeException("Not authorized");
        }

        match.setStatus(MatchStatus.ACCEPTED);
        matchRepository.save(match);

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

        if (!isAuthorized(match, user)) {
            throw new RuntimeException("Not authorized");
        }

        match.setStatus(MatchStatus.REJECTED);
        matchRepository.save(match);

        return mapToResponse(match);
    }

    /**
     * 🔹 Authorization helper
     */
    private boolean isAuthorized(MatchEntity match, User user) {
        return match.getProvider().getId().equals(user.getId()) ||
               match.getCitizen().getId().equals(user.getId());
    }

    /**
     * Convert entity → DTO
     */
    private MatchResponse mapToResponse(MatchEntity match) {

        String expertise = "";
        String location = "";

        LawyerProfile lp = lawyerRepository.findByUser(match.getProvider()).orElse(null);
        NGOProfile np = ngoRepository.findByUser(match.getProvider()).orElse(null);

        if (lp != null) {
            expertise = lp.getExpertise();
            location = lp.getLocation();
        } else if (np != null) {
            expertise = np.getFocusArea();
            location = np.getLocation();
        }

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
                .providerExpertise(expertise)
                .providerLocation(location)
                .matchScore(match.getMatchScore())
                .status(match.getStatus().name())
                .createdAt(match.getCreatedAt())
                .build();
    }
}