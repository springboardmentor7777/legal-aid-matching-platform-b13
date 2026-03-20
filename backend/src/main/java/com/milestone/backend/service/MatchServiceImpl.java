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

        //  Prevent duplicate generation for same case
        List<Match> existingMatches = matchRepository.findByCaseId(caseId);
        if (!existingMatches.isEmpty()) {
            return existingMatches.stream()
                    .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
                    .limit(5)
                    .map(this::mapToResponse)
                    .toList();
        }

        List<User> users = userRepository.findByRoleIn(
                List.of(Role.LAWYER, Role.NGO));

        List<Match> matches = new ArrayList<>();

        for (User user : users) {

            // Skip unavailable lawyers
            if (user.getRole() == Role.LAWYER &&
                    (user.getLawyerProfile() == null ||
                            !Boolean.TRUE.equals(user.getLawyerProfile().getIsAvailable()))) {
                continue;
            }

            //  Skip unavailable NGOs
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

        //  Check if case already accepted
        boolean alreadyAccepted = matchRepository.existsByCaseIdAndStatus(
                match.getCaseId(), MatchStatus.ACCEPTED);

        if (alreadyAccepted) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Case already accepted");
        }

        //  Accept this match
        match.setStatus(MatchStatus.ACCEPTED);
        matchRepository.save(match);

        //  Reject all other matches
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
        String caseCategory = Optional.ofNullable(caseObj.getCategory()).orElse("");
        String caseLocation = Optional.ofNullable(caseObj.getLocation()).orElse("");

        // 1. SCORING FOR LAWYERS
        if (user.getRole() == Role.LAWYER && user.getLawyerProfile() != null) {

            LawyerProfile profile = user.getLawyerProfile();
            String specialization = Optional.ofNullable(profile.getSpecialization()).orElse("");
            String lawyerLocation = Optional.ofNullable(profile.getLocation()).orElse("");

            // Category Match
            if (specialization.equalsIgnoreCase(caseCategory)) {
                score += 40;
            }

            // Experience Match
            if (profile.getExperience() != null) {
                int exp = profile.getExperience();
                if (exp >= 10) score += 25;
                else if (exp >= 5) score += 18;
                else if (exp >= 2) score += 10;
                else score += 5;
            }

            // Location Match
            if (lawyerLocation.equalsIgnoreCase(caseLocation)) {
                score += 20;
            }

            // Availability Bonus
            if (Boolean.TRUE.equals(profile.getIsAvailable())) {
                score += 15;
            }
        }

        // 2. SCORING FOR NGOS ( FIXED LOGIC)
        if (user.getRole() == Role.NGO && user.getNgoProfile() != null) {

            NgoProfile profile = user.getNgoProfile();
            String serviceArea = Optional.ofNullable(profile.getServiceArea()).orElse("");
            String ngoLocation = Optional.ofNullable(profile.getLocation()).orElse("");

            // Category/Service Area Match ( Fixed: Service Area to Category)
            if (serviceArea.equalsIgnoreCase(caseCategory)) {
                score += 40;
            }

            // Location Match ( Fixed: Location to Location)
            if (ngoLocation.equalsIgnoreCase(caseLocation)) {
                score += 30; 
            }

            // Availability Bonus
            if (Boolean.TRUE.equals(profile.getIsAvailable())) {
                score += 10;
            }
        }

        return score;
    }
    private MatchResponse mapToResponse(Match match) {

        MatchResponse response = new MatchResponse();

        response.setMatchId(match.getId());
        response.setCaseId(match.getCaseId());
        response.setUserId(match.getUserId());
        response.setScore(match.getScore());
        response.setStatus(match.getStatus().name());

        // ADDED LOGIC TO FETCH NAMES FOR THE FRONTEND
        try {
            // Get the Provider (Lawyer or NGO)
            User matchedProvider = userRepository.findById(match.getUserId()).orElse(null);
            if (matchedProvider != null) {
                response.setProviderName(matchedProvider.getUsername());
                response.setProviderType(matchedProvider.getRole().name());
            }

            // Get the Client (Citizen who created the case)
            Case caseEntity = caseRepository.findById(match.getCaseId()).orElse(null);
            if (caseEntity != null && caseEntity.getUser() != null) {
                response.setClientName(caseEntity.getUser().getUsername());
            }
        } catch (Exception e) {
            System.err.println("Error fetching user names for Match DTO: " + e.getMessage());
        }

        return response;
    }
    @Override
    public MatchResponse getMatchById(Long matchId, User currentUser) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Match not found"));

        Case caseObj = caseRepository.findById(match.getCaseId()).orElse(null);

        // Security check to make sure random users can't read matches
        if (caseObj != null && !caseObj.getUser().getId().equals(currentUser.getId()) && !match.getUserId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized access to this match.");
        }

        return mapToResponse(match);
    }
}