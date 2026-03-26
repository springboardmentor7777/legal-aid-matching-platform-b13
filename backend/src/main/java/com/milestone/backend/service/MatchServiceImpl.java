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

    // ─────────────────────────────────────────────────────────────────────────────
    // Generate matches for a case (idempotent — no duplicates)
    //
    // Scores all available Lawyers and NGOs against the case using calculateScore().
    // Saves each scored Match with status PENDING, then returns the top 5 by score.
    // If matches already exist for this case, they are returned without re-generating.
    // ─────────────────────────────────────────────────────────────────────────────
    @Override
    public List<MatchResponse> generateMatches(Long caseId) {

        Case caseObj = caseRepository.findById(caseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Case not found"));

        // Guard: if matches were already generated for this case, return them sorted
        List<Match> existingMatches = matchRepository.findByCaseId(caseId);
        if (!existingMatches.isEmpty()) {
            return existingMatches.stream()
                    .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
                    .limit(5)
                    .map(this::mapToResponse)
                    .toList();
        }

        // Fetch all Lawyers and NGOs to score against this case
        List<User> users = userRepository.findByRoleIn(List.of(Role.LAWYER, Role.NGO));

        List<Match> matches = new ArrayList<>();

        for (User user : users) {

            // Skip Lawyers who have no profile or are marked unavailable
            if (user.getRole() == Role.LAWYER &&
                    (user.getLawyerProfile() == null ||
                            !Boolean.TRUE.equals(user.getLawyerProfile().getIsAvailable()))) {
                continue;
            }

            // Skip NGOs who have no profile or are marked unavailable
            if (user.getRole() == Role.NGO &&
                    (user.getNgoProfile() == null ||
                            !Boolean.TRUE.equals(user.getNgoProfile().getIsAvailable()))) {
                continue;
            }

            // FIX: Per-provider duplicate guard.
            // The top-level existingMatches check only catches a full re-generation
            // attempt, but repeated "Generate" button clicks can still sneak through
            // if the first batch was only partially saved. This per-row check ensures
            // we never create two Match rows for the same (caseId, providerId) pair.
            if (matchRepository.existsByCaseIdAndUserId(caseId, user.getId())) {
                continue;
            }

            double score = calculateScore(caseObj, user);

            Match match = new Match();
            match.setCaseId(caseId);
            match.setUserId(user.getId());
            match.setScore(score);
            match.setStatus(MatchStatus.PENDING);   // All new matches start as PENDING

            matches.add(matchRepository.save(match));
        }

        // Sort descending by score and return top 5
        matches.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));

        return matches.stream()
                .limit(5)
                .map(this::mapToResponse)
                .toList();
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Get matches for the currently authenticated user
    //
    // Citizens   → all matches across their cases (via case ownership)
    // Lawyers/NGOs → only matches where they are the assigned provider
    // ─────────────────────────────────────────────────────────────────────────────
    @Override
    public List<MatchResponse> getMyMatches(User user) {

        List<Match> matches;

        if (user.getRole() == Role.CITIZEN) {
            // FIX: Fetch only non-REJECTED matches for the citizen.
            // Previously this fetched ALL matches across ALL of the citizen's cases,
            // including REJECTED rows left over from old generate runs, causing
            // duplicate/stale cards to appear on every subsequent generate click.
            matches = matchRepository.findByCaseEntity_User_IdAndStatusNot(
                    user.getId(), MatchStatus.REJECTED);
        } else {
            // Lawyers/NGOs: only show PENDING and ACCEPTED matches so they can
            // see who has chosen them without exposing other citizens' data
            matches = matchRepository.findVisibleMatchesForProvider(user.getId());
        }

        return matches.stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Get matches for a specific case (Citizen only)
    //
    // FIX: Added to support the dropdown in MatchingResults.tsx.
    // GET /matches/me was returning all matches across all of the citizen's cases,
    // so switching the dropdown had no visible effect — the grid always showed
    // everything. This method scopes results to one case and excludes REJECTED
    // matches so stale cards from old runs don't pollute the view.
    // ─────────────────────────────────────────────────────────────────────────────
    @Override
    public List<MatchResponse> getMatchesForCase(Long caseId, User currentUser) {

        Case caseObj = caseRepository.findById(caseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Case not found"));

        // Only the Citizen who owns the case can view its matches
        if (!caseObj.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized access to this case's matches.");
        }

        // Return non-REJECTED matches sorted by score descending
        return matchRepository.findByCaseIdAndStatusNot(caseId, MatchStatus.REJECTED)
                .stream()
                .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
                .map(this::mapToResponse)
                .toList();
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Accept a match — called by the Citizen
    //
    // FIX: Removed the INTERESTED state requirement. The old flow required the
    // Lawyer to "express interest" before the Citizen could accept, but that step
    // has been removed. Citizens can now accept any PENDING match directly.
    //
    // Flow: PENDING → ACCEPTED
    // Side effect: all other PENDING matches for the same case → REJECTED
    // ─────────────────────────────────────────────────────────────────────────────
    @Override
    @Transactional
    public MatchResponse acceptMatch(Long matchId, User currentUser) {

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Match not found"));

        Case caseObj = caseRepository.findById(match.getCaseId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Case not found"));

        // Only the Citizen who owns the case can accept a provider
        if (!caseObj.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Only the citizen who created the case can accept a provider."
            );
        }

        // FIX: Previously this check required status == INTERESTED, which blocked
        // acceptance because expressInterest has been removed from the flow.
        // Now we only require that the match is still PENDING (not already
        // accepted or rejected).
        if (match.getStatus() != MatchStatus.PENDING) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Cannot accept: this match is already " + match.getStatus().name() + "."
            );
        }

        match.setStatus(MatchStatus.ACCEPTED);
        match = matchRepository.save(match);

        // Automatically reject all remaining PENDING matches for this case
        // so no other provider is left waiting
        matchRepository.rejectOtherMatches(match.getCaseId(), match.getId());

        return mapToResponse(match);
    }

    // NOTE: expressInterest() has been removed.
    // The INTERESTED status and the two-step accept flow (provider → citizen)
    // are no longer part of this system. Citizens accept providers directly.

    // ─────────────────────────────────────────────────────────────────────────────
    // Reject a match — can be called by either the Citizen or the Provider
    //
    // Citizen    → dismisses a match they do not want (e.g. score is too low)
    // Lawyer/NGO → declines the case before the Citizen accepts
    //
    // Flow: PENDING → REJECTED
    // ─────────────────────────────────────────────────────────────────────────────
    @Override
    public MatchResponse rejectMatch(Long matchId, User currentUser) {

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Match not found"));

        Case caseObj = caseRepository.findById(match.getCaseId()).orElse(null);

        // Determine if the caller is the matched provider or the case's citizen
        boolean isProvider = match.getUserId().equals(currentUser.getId());
        boolean isCitizen  = caseObj != null && caseObj.getUser().getId().equals(currentUser.getId());

        if (!isProvider && !isCitizen) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Unauthorized to reject this match."
            );
        }

        match.setStatus(MatchStatus.REJECTED);
        return mapToResponse(matchRepository.save(match));
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Matching algorithm
    //
    // Returns a score out of 100 for a given (case, user) pair.
    // Lawyers and NGOs are scored differently based on their profile fields.
    // ─────────────────────────────────────────────────────────────────────────────
    private double calculateScore(Case caseObj, User user) {

        double score = 0.0;
        String caseCategory = Optional.ofNullable(caseObj.getCategory()).orElse("");
        String caseLocation  = Optional.ofNullable(caseObj.getLocation()).orElse("");

        // ── Lawyer scoring ────────────────────────────────────────────────────────
        if (user.getRole() == Role.LAWYER && user.getLawyerProfile() != null) {

            LawyerProfile profile = user.getLawyerProfile();
            String specialization  = Optional.ofNullable(profile.getSpecialization()).orElse("");
            String lawyerLocation  = Optional.ofNullable(profile.getLocation()).orElse("");

            // +40 if the lawyer's specialization matches the case category
            if (specialization.equalsIgnoreCase(caseCategory)) {
                score += 40;
            }

            // Experience bonus (tiered)
            if (profile.getExperience() != null) {
                int exp = profile.getExperience();
                if      (exp >= 10) score += 25;
                else if (exp >= 5)  score += 18;
                else if (exp >= 2)  score += 10;
                else                score += 5;
            }

            // +20 if the lawyer is in the same location as the case
            if (lawyerLocation.equalsIgnoreCase(caseLocation)) {
                score += 20;
            }

            // +15 availability bonus
            if (Boolean.TRUE.equals(profile.getIsAvailable())) {
                score += 15;
            }
        }

        // ── NGO scoring ───────────────────────────────────────────────────────────
        if (user.getRole() == Role.NGO && user.getNgoProfile() != null) {

            NgoProfile profile = user.getNgoProfile();
            String serviceArea  = Optional.ofNullable(profile.getServiceArea()).orElse("");
            String ngoLocation  = Optional.ofNullable(profile.getLocation()).orElse("");

            // +40 if the NGO's service area matches the case category
            if (serviceArea.equalsIgnoreCase(caseCategory)) {
                score += 40;
            }

            // +30 if the NGO is in the same location as the case
            if (ngoLocation.equalsIgnoreCase(caseLocation)) {
                score += 30;
            }

            // +10 availability bonus
            if (Boolean.TRUE.equals(profile.getIsAvailable())) {
                score += 10;
            }
        }

        return score;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Map a Match entity to a MatchResponse DTO
    //
    // Enriches the response with provider name/email/type and the client's name
    // so the frontend does not need to make separate API calls for display.
    // ─────────────────────────────────────────────────────────────────────────────
    private MatchResponse mapToResponse(Match match) {

        MatchResponse response = new MatchResponse();
        response.setMatchId(match.getId());
        response.setCaseId(match.getCaseId());
        response.setUserId(match.getUserId());
        response.setScore(match.getScore());
        response.setStatus(match.getStatus().name());

        // Fetch provider and client details for frontend display
        try {
            // Provider (Lawyer or NGO) details
            User matchedProvider = userRepository.findById(match.getUserId()).orElse(null);
            if (matchedProvider != null) {
                response.setProviderName(matchedProvider.getName());
                response.setProviderEmail(matchedProvider.getUsername());
                response.setProviderType(matchedProvider.getRole().name());
            }

            // Client (Citizen who created the case) name
            Case caseEntity = caseRepository.findById(match.getCaseId()).orElse(null);
            if (caseEntity != null && caseEntity.getUser() != null) {
                response.setClientName(caseEntity.getUser().getName());
            }
        } catch (Exception e) {
            System.err.println("Error enriching MatchResponse with user names: " + e.getMessage());
        }

        return response;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Get a single match by ID
    //
    // Security: only the case's Citizen owner or the matched provider can read it.
    // ─────────────────────────────────────────────────────────────────────────────
    @Override
    public MatchResponse getMatchById(Long matchId, User currentUser) {

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Match not found"));

        Case caseObj = caseRepository.findById(match.getCaseId()).orElse(null);

        boolean isCaseOwner  = caseObj != null && caseObj.getUser().getId().equals(currentUser.getId());
        boolean isProvider   = match.getUserId().equals(currentUser.getId());

        if (!isCaseOwner && !isProvider) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized access to this match.");
        }

        return mapToResponse(match);
    }
}
