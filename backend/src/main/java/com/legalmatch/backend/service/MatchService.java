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
        List<MatchEntity> matches = new ArrayList<>();

        // =========================
        // 🔹 LAWYER MATCHING
        // =========================
        List<LawyerProfile> lawyers = lawyerRepository.findAll();

        for (LawyerProfile lp : lawyers) {

            //if (lp.getVerified() != null && !lp.getVerified()) continue;

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
                matches.add(saved);

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

            //if (np.getVerified() != null && !np.getVerified()) continue;

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
                matches.add(saved);

                notificationService.createNotification(
                        np.getUser(),
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
     * 🔹 Lawyer scoring
     */
    private double calculateLawyerScore(Case legalCase, LawyerProfile lp) {

        double score = 0;

        String caseType = legalCase.getCaseType() != null
                ? legalCase.getCaseType().toLowerCase()
                : "";

        String expertise = lp.getExpertise() != null
                ? lp.getExpertise().toLowerCase()
                : "";

        if (expertise.contains("advocate")) {
            score += 30;
        }
        if (expertise.contains("criminal")) {
            score += 20;
        }


        if (legalCase.getLocation() != null &&
            lp.getLocation() != null &&
            lp.getLocation().toLowerCase().contains(legalCase.getLocation().toLowerCase())) {
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

        if (legalCase.getLocation() != null &&
            np.getLocation() != null &&
            np.getLocation().toLowerCase().contains(legalCase.getLocation().toLowerCase())) {
            score += 40;
        }

        if (np.getFocusArea() != null &&
            legalCase.getCaseType() != null &&
            np.getFocusArea().toLowerCase().contains(legalCase.getCaseType().toLowerCase())) {
            score += 30;
        }

        if (Boolean.TRUE.equals(np.getVerified())) {
            score += 20;
        }

        return score;
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
     * 🔹 Convert entity → DTO
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