package com.milestone.backend.service;

import com.milestone.backend.dto.MatchResponse;
import com.milestone.backend.entity.*;
import com.milestone.backend.repository.CaseRepository;
import com.milestone.backend.repository.MatchRepository;
import com.milestone.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchingServiceImpl implements MatchingService {

    private final CaseRepository caseRepository;
    private final UserRepository userRepository;
    private final MatchRepository matchRepository;

    // =========================
    // 1. DISCOVER: Calculate scores, DO NOT save
    // =========================
    @Override
    @Transactional(readOnly = true)
    public List<MatchResponse> getPotentialProviders(Long caseId) {
        Case legalCase = caseRepository.findById(caseId)
                .orElseThrow(() -> new MatchNotFoundException(caseId));

        Role targetRole = determineTargetRole(legalCase);

        List<User> eligibleProviders = userRepository.findAllByRole(targetRole);

        return eligibleProviders.stream()
                .map(provider -> {
                    MatchResponse dto = toDtoFromEntities(provider, legalCase);
                    dto.setScore(calculateScore(provider, legalCase));
                    dto.setStatus("AVAILABLE");
                    return dto;
                })
                .sorted(Comparator.comparingInt(MatchResponse::getScore).reversed())
                .collect(Collectors.toList());
    }

    // =========================
    // 2. CREATE MATCH REQUEST
    // =========================
    @Override
    @Transactional
    public MatchResponse createMatchRequest(Long caseId, Long providerId) {
        if (matchRepository.existsByLegalCase_IdAndMatchedProvider_Id(caseId, providerId)) {
            throw new DuplicateMatchRequestException(caseId, providerId);
        }

        Case legalCase = caseRepository.findById(caseId)
                .orElseThrow(() -> new MatchNotFoundException(caseId));
        User provider = userRepository.findById(providerId)
                .orElseThrow(() -> new ProviderNotFoundException(providerId));

        Match match = new Match();
        match.setLegalCase(legalCase);
        match.setMatchedProvider(provider);
        match.setScore(calculateScore(provider, legalCase));
        match.setStatus(Match.MatchStatus.PENDING);

        return toDto(matchRepository.save(match));
    }

    // =========================
    // 3. GET MATCHES FOR USER
    // =========================
    @Override
    @Transactional(readOnly = true)
    public List<MatchResponse> getMatchesForUser(User user) {
        List<Match> matches = (user.getRole() == Role.CITIZEN)
                ? matchRepository.findByLegalCase_User_IdOrderByScoreDesc(user.getId())
                : matchRepository.findByMatchedProvider_IdOrderByScoreDesc(user.getId());

        return matches.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // =========================
    // 4. ACCEPT / REJECT MATCH
    // =========================
    @Override
    @Transactional
    public MatchResponse acceptMatch(Long matchId) {
        Match match = matchRepository.findByIdWithProfiles(matchId)
                .orElseThrow(() -> new MatchNotFoundException(matchId));

        if (match.getStatus() != Match.MatchStatus.PENDING) {
            throw new MatchAlreadyProcessedException(matchId, match.getStatus());
        }

        match.setStatus(Match.MatchStatus.ACCEPTED);
        if (match.getScore() == null) match.setScore(0);

        return toDto(matchRepository.save(match));
    }

    @Override
    @Transactional
    public MatchResponse rejectMatch(Long matchId) {
        Match match = matchRepository.findByIdWithProfiles(matchId)
                .orElseThrow(() -> new MatchNotFoundException(matchId));

        if (match.getStatus() != Match.MatchStatus.PENDING) {
            throw new MatchAlreadyProcessedException(matchId, match.getStatus());
        }

        match.setStatus(Match.MatchStatus.REJECTED);
        if (match.getScore() == null) match.setScore(0);

        return toDto(matchRepository.save(match));
    }

    // =========================
    // --- Private Helpers ---
    // =========================
    private int calculateScore(User provider, Case legalCase) {
        int score = 0;
        String caseCat = legalCase.getCategory() != null ? legalCase.getCategory().toLowerCase() : "";
        String caseLoc = legalCase.getLocation() != null ? legalCase.getLocation().toLowerCase() : "";

        if (provider.getRole() == Role.LAWYER && provider.getLawyerProfile() != null) {
            LawyerProfile lp = provider.getLawyerProfile();
            if (lp.getSpecialization() != null && caseCat.contains(lp.getSpecialization().toLowerCase())) score += 50;
            if (lp.getLocation() != null && caseLoc.contains(lp.getLocation().toLowerCase())) score += 30;
            if (lp.getExperience() != null) score += Math.min(lp.getExperience(), 20);
        } else if (provider.getRole() == Role.NGO && provider.getNgoProfile() != null) {
            NgoProfile np = provider.getNgoProfile();
            if (np.getServiceArea() != null && caseLoc.contains(np.getServiceArea().toLowerCase())) score += 40;
        }
        return score;
    }

    private MatchResponse toDto(Match match) {
        MatchResponse dto = toDtoFromEntities(match.getMatchedProvider(), match.getLegalCase());
        dto.setMatchId(match.getId());
        dto.setStatus(match.getStatus() != null ? match.getStatus().name() : "UNKNOWN");
        dto.setScore(match.getScore() != null ? match.getScore() : 0);
        return dto;
    }

    private MatchResponse toDtoFromEntities(User provider, Case legalCase) {
        if (provider == null) provider = new User();
        if (legalCase == null) legalCase = new Case();

        String spec = null, loc = null, srv = null;
        Integer exp = null;

        if (provider.getRole() == Role.LAWYER && provider.getLawyerProfile() != null) {
            spec = provider.getLawyerProfile().getSpecialization();
            exp = provider.getLawyerProfile().getExperience();
            loc = provider.getLawyerProfile().getLocation();
        } else if (provider.getRole() == Role.NGO && provider.getNgoProfile() != null) {
            srv = provider.getNgoProfile().getServiceArea();
        }

        return new MatchResponse(
                null, "AVAILABLE", 0,
                legalCase.getId(), legalCase.getTitle(),
                provider.getId(), provider.getName(), provider.getRole() != null ? provider.getRole().name() : "UNKNOWN",
                spec, exp, loc, srv
        );
    }

    private Role determineTargetRole(Case legalCase) {
        String cat = legalCase.getCategory() != null ? legalCase.getCategory().toLowerCase() : "";
        return (cat.contains("ngo") || cat.contains("support")) ? Role.NGO : Role.LAWYER;
    }

    // =========================
    // --- Custom Exceptions ---
    // =========================
    public static class MatchNotFoundException extends RuntimeException {
        public MatchNotFoundException(Long matchId) { super("Match not found with ID: " + matchId); }
    }

    public static class MatchAlreadyProcessedException extends RuntimeException {
        public MatchAlreadyProcessedException(Long matchId, Match.MatchStatus status) {
            super("Match with ID " + matchId + " is already " + status);
        }
    }

    public static class DuplicateMatchRequestException extends RuntimeException {
        public DuplicateMatchRequestException(Long caseId, Long providerId) {
            super("Duplicate request for case " + caseId + " and provider " + providerId);
        }
    }

    public static class ProviderNotFoundException extends RuntimeException {
        public ProviderNotFoundException(Long providerId) {
            super("Provider not found with ID: " + providerId);
        }
    }
}