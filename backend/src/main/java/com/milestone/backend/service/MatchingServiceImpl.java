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

    @Override
    @Transactional
    public List<MatchResponse> generateMatchesForCase(Long caseId) {
        Case legalCase = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        Role targetRole = Role.LAWYER; // or determine dynamically

        List<User> providers = userRepository.findAllByRole(targetRole);

        List<Match> generatedMatches = new ArrayList<>();

        for (User provider : providers) {
            if (matchRepository.existsByLegalCase_IdAndMatchedProvider_Id(caseId, provider.getId())) {
                continue;
            }

            int score = 0;

            // Category/expertise match
            if (targetRole == Role.LAWYER &&
                legalCase.getCategory() != null &&
                provider.getLawyerProfile() != null &&
                provider.getLawyerProfile().getSpecialization() != null &&
                legalCase.getCategory().equalsIgnoreCase(provider.getLawyerProfile().getSpecialization())) {
                score += 50;
            }

            // Location match
            String caseLocation = legalCase.getLocation();
            if (caseLocation != null) {
                if (targetRole == Role.LAWYER &&
                        provider.getLawyerProfile() != null &&
                        provider.getLawyerProfile().getLocation() != null &&
                        provider.getLawyerProfile().getLocation().equalsIgnoreCase(caseLocation)) {
                    score += 30;
                }
                if (targetRole == Role.NGO &&
                        provider.getNgoProfile() != null &&
                        provider.getNgoProfile().getServiceArea() != null &&
                        provider.getNgoProfile().getServiceArea().equalsIgnoreCase(caseLocation)) {
                    score += 30;
                }
            }

            // Experience points
            if (targetRole == Role.LAWYER &&
                provider.getLawyerProfile() != null &&
                provider.getLawyerProfile().getExperience() != null) {
                score += Math.min(provider.getLawyerProfile().getExperience(), 20);
            }

            if (score > 0) {
                Match match = new Match();
                match.setLegalCase(legalCase);
                match.setMatchedProvider(provider);
                match.setStatus(Match.MatchStatus.PENDING);
                matchRepository.save(match);
                generatedMatches.add(match);
            }
        }

        return generatedMatches.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MatchResponse> getMatchesForProvider(Long providerId) {
        List<Match> matches = matchRepository.findByMatchedProvider_Id(providerId);
        return matches.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MatchResponse acceptMatch(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
        match.setStatus(Match.MatchStatus.ACCEPTED);
        matchRepository.save(match);
        return toDto(match);
    }

    @Override
    @Transactional
    public MatchResponse rejectMatch(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
        match.setStatus(Match.MatchStatus.REJECTED);
        matchRepository.save(match);
        return toDto(match);
    }

    // ===== Helper method to convert Match -> MatchResponse =====
    private MatchResponse toDto(Match match) {
        User provider = match.getMatchedProvider();

        String specialization = null;
        Integer experience = null;
        String location = null;
        String serviceArea = null;

        if (provider.getRole() == Role.LAWYER && provider.getLawyerProfile() != null) {
            specialization = provider.getLawyerProfile().getSpecialization();
            experience = provider.getLawyerProfile().getExperience();
            location = provider.getLawyerProfile().getLocation();
        } else if (provider.getRole() == Role.NGO && provider.getNgoProfile() != null) {
            serviceArea = provider.getNgoProfile().getServiceArea();
        }

        return new MatchResponse(
                match.getId(),
                match.getStatus().name(),
                match.getLegalCase().getId(),
                match.getLegalCase().getTitle(),
                provider.getId(),
                provider.getName(),
                provider.getRole().name(),
                specialization,
                experience,
                location,
                serviceArea
        );
    }
}