package com.milestone.backend.service;

import com.milestone.backend.dto.MatchResponse;
import com.milestone.backend.entity.*;
import com.milestone.backend.repository.CaseRepository;
import com.milestone.backend.repository.MatchRepository;
import com.milestone.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
@RequiredArgsConstructor
public class MatchServiceImpl implements MatchService {

    private final MatchRepository matchRepository;
    private final CaseRepository caseRepository;
    private final UserRepository userRepository;

    /**
     * Generate matches for a case
     */
    @Override
    public List<MatchResponse> generateMatches(Long caseId) {

        Case caseObj = caseRepository.findById(caseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Case not found"));

        // Fetch LAWYER + NGO users
        List<User> users = userRepository.findByRoleIn(
                List.of(Role.LAWYER, Role.NGO)
        );

        List<Match> matches = new ArrayList<>();

        for (User user : users) {

            // Skip unavailable lawyer
            if (user.getRole() == Role.LAWYER &&
                    (user.getLawyerProfile() == null ||
                            !Boolean.TRUE.equals(user.getLawyerProfile().getIsAvailable()))) {
                continue;
            }

            // Skip unavailable NGO
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

        // Sort by score descending
        matches.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));

        List<MatchResponse> responses = new ArrayList<>();

        matches.stream()
                .limit(5)
                .forEach(match -> responses.add(mapToResponse(match)));

        return responses;
    }

    /**
     * Get matches for user (provider or citizen)
     */
    @Override
    public List<MatchResponse> getMyMatches(User user) {
        List<Match> matches;

        if (user.getRole() == Role.CITIZEN) {
            // For citizens, get matches for their cases
            matches = matchRepository.findByCaseEntity_User_Id(user.getId());
        } else {
            // For providers (lawyer/NGO), get assigned matches
            matches = matchRepository.findByUserId(user.getId());
        }

        List<MatchResponse> responses = new ArrayList<>();

        for (Match match : matches) {
            responses.add(mapToResponse(match));
        }

        return responses;
    }

    /**
     * Accept match
     */
    @Override
    public MatchResponse acceptMatch(Long matchId) {

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Match not found"));

        match.setStatus(MatchStatus.ACCEPTED);

        matchRepository.save(match);

        return mapToResponse(match);
    }

    /**
     * Reject match
     */
    @Override
    public MatchResponse rejectMatch(Long matchId) {

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

        // LAWYER MATCHING
        if (user.getRole() == Role.LAWYER && user.getLawyerProfile() != null) {

            LawyerProfile profile = user.getLawyerProfile();

            String caseCategory = Optional.ofNullable(caseObj.getCategory()).orElse("");
            String specialization = Optional.ofNullable(profile.getSpecialization()).orElse("");

            if (specialization.equalsIgnoreCase(caseCategory)) {
                score += 40;
            }

            if (profile.getExperience() != null) {

                int exp = profile.getExperience();

                if (exp >= 10) score += 25;
                else if (exp >= 5) score += 18;
                else if (exp >= 2) score += 10;
                else score += 5;
            }

            String caseLocation = Optional.ofNullable(caseObj.getLocation()).orElse("");
            String lawyerLocation = Optional.ofNullable(profile.getLocation()).orElse("");

            if (lawyerLocation.equalsIgnoreCase(caseLocation)) {
                score += 20;
            }

            if (Boolean.TRUE.equals(profile.getIsAvailable())) {
                score += 15;
            }
        }

        // NGO MATCHING
        if (user.getRole() == Role.NGO && user.getNgoProfile() != null) {

            NgoProfile profile = user.getNgoProfile();

            String caseLocation = Optional.ofNullable(caseObj.getLocation()).orElse("");
            String serviceArea = Optional.ofNullable(profile.getServiceArea()).orElse("");

            if (serviceArea.equalsIgnoreCase(caseLocation)) {
                score += 30;
            }

            if (Boolean.TRUE.equals(profile.getIsAvailable())) {
                score += 10;
            }
        }

        System.out.println("User ID: " + user.getId() + " Score: " + score);

        return score;
    }

    /**
     * Convert Entity -> DTO
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