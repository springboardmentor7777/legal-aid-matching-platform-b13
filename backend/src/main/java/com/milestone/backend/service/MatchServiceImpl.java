package com.milestone.backend.service;

import com.milestone.backend.dto.MatchResponse;
import com.milestone.backend.entity.*;
import com.milestone.backend.repository.CaseRepository;
import com.milestone.backend.repository.MatchRepository;
import com.milestone.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
@RequiredArgsConstructor
public class MatchServiceImpl implements MatchService {

    private final MatchRepository matchRepository;
    private final CaseRepository caseRepository;
    private final UserRepository userRepository;

    /**
     * Generate matches for a case (NO DUPLICATES)
     */
    @Override
    public List<MatchResponse> generateMatches(Long caseId) {

        Case caseObj = caseRepository.findById(caseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Case not found"));

        // ✅ Prevent duplicate generation for same case
        List<Match> existingMatches = matchRepository.findByCaseId(caseId);
        if (!existingMatches.isEmpty()) {
            return existingMatches.stream()
                    .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
                    .limit(5)
                    .map(this::mapToResponse)
                    .toList();
        }

        List<User> users = userRepository.findByRoleIn(
                List.of(Role.LAWYER, Role.NGO)
        );

        List<Match> matches = new ArrayList<>();

        for (User user : users) {

            // ❌ Skip unavailable lawyers
            if (user.getRole() == Role.LAWYER &&
                    (user.getLawyerProfile() == null ||
                     !Boolean.TRUE.equals(user.getLawyerProfile().getIsAvailable()))) {
                continue;
            }

            // ❌ Skip unavailable NGOs
            if (user.getRole() == Role.NGO &&
                    (user.getNgoProfile() == null ||
                     !Boolean.TRUE.equals(user.getNgoProfile().getIsAvailable()))) {
                continue;
            }

            double score = calculateScore(caseObj, user);

            Match match = new Match();
            match.setCaseId(caseId);
            match.setUserId(user.getId());
            match.setScore(score);
            match.setStatus(MatchStatus.PENDING);

            matches.add(matchRepository.save(match));
        }

        // Sort by score (desc)
        matches.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));

        return matches.stream()
                .limit(5)
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Get matches for current user
     */
    @Override
    public List<MatchResponse> getMyMatches(User user) {

        List<Match> matches;

        if (user.getRole() == Role.CITIZEN) {
            matches = matchRepository.findByCaseEntity_User_Id(user.getId());
        } else {
            matches = matchRepository.findVisibleMatchesForProvider(user.getId());
        }

        return matches.stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Accept match (only one allowed per case)
     */
    @Override
    @Transactional
    public MatchResponse acceptMatch(Long matchId, User currentUser) {

        if (currentUser.getRole() != Role.LAWYER &&
            currentUser.getRole() != Role.NGO) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only lawyer/NGO can accept");
        }

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Match not found"));

        // ❌ Check if case already accepted
        boolean alreadyAccepted = matchRepository.existsByCaseIdAndStatus(
                match.getCaseId(), MatchStatus.ACCEPTED
        );

        if (alreadyAccepted) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Case already accepted");
        }

        // ✅ Accept this match
        match.setStatus(MatchStatus.ACCEPTED);
        matchRepository.save(match);

        // ❌ Reject all other matches
        matchRepository.rejectOtherMatches(match.getCaseId(), matchId);

        return mapToResponse(match);
    }

    /**
     * Reject match
     */
    @Override
    public MatchResponse rejectMatch(Long matchId, User currentUser) {

        if (currentUser.getRole() != Role.LAWYER &&
            currentUser.getRole() != Role.NGO) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only lawyer/NGO can reject");
        }

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Match not found"));

        match.setStatus(MatchStatus.REJECTED);
        matchRepository.save(match);

        return mapToResponse(match);
    }

    /**
     * Matching Algorithm
     */
    private double calculateScore(Case caseObj, User user) {

        double score = 0.0;

        if (user.getRole() == Role.LAWYER && user.getLawyerProfile() != null) {

            LawyerProfile profile = user.getLawyerProfile();

            String caseCategory = Optional.ofNullable(caseObj.getCategory()).orElse("");
            String specialization = Optional.ofNullable(profile.getSpecialization()).orElse("");

            if (specialization.equalsIgnoreCase(caseCategory)) score += 40;

            if (profile.getExperience() != null) {
                int exp = profile.getExperience();
                if (exp >= 10) score += 25;
                else if (exp >= 5) score += 18;
                else if (exp >= 2) score += 10;
                else score += 5;
            }

            String caseLocation = Optional.ofNullable(caseObj.getLocation()).orElse("");
            String lawyerLocation = Optional.ofNullable(profile.getLocation()).orElse("");

            if (lawyerLocation.equalsIgnoreCase(caseLocation)) score += 20;

            if (Boolean.TRUE.equals(profile.getIsAvailable())) score += 15;
        }

        if (user.getRole() == Role.NGO && user.getNgoProfile() != null) {

            NgoProfile profile = user.getNgoProfile();

            String caseLocation = Optional.ofNullable(caseObj.getLocation()).orElse("");
            String serviceArea = Optional.ofNullable(profile.getServiceArea()).orElse("");

            if (serviceArea.equalsIgnoreCase(caseLocation)) score += 30;

            if (Boolean.TRUE.equals(profile.getIsAvailable())) score += 10;
        }

        return score;
    }

    /**
     * Map entity → DTO
     */
    private MatchResponse mapToResponse(Match match) {

        MatchResponse response = new MatchResponse();

        response.setMatchId(match.getId());
        response.setCaseId(match.getCaseId());
        response.setUserId(match.getUserId());
        response.setScore(match.getScore());
        response.setStatus(match.getStatus().name());

        return response;
    }
}