package com.milestone.backend.controller;

import com.milestone.backend.dto.MatchResponse;
import com.milestone.backend.entity.User;
import com.milestone.backend.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    // ─────────────────────────────────────────────────────────────────────────────
    // POST /matches/generate/{caseId}
    // Generates up to 5 scored matches for the given case.
    // Idempotent: if matches already exist for this case, they are returned as-is.
    // Only the Citizen who owns the case should call this; no role guard is set
    // here because the service layer validates ownership via the case's user field.
    // ─────────────────────────────────────────────────────────────────────────────
    @PostMapping("/generate/{caseId}")
    @PreAuthorize("hasRole('CITIZEN')")
    public List<MatchResponse> generateMatches(@PathVariable Long caseId) {
        return matchService.generateMatches(caseId);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET /matches/case/{caseId}
    // Returns all non-REJECTED matches for a specific case.
    // FIX: Added to support the dropdown-filtered view in MatchingResults.
    // The old GET /matches/me endpoint returned all cases at once, which meant
    // the dropdown selection was visually present but had no effect on what cards
    // were shown. This endpoint scopes the results to exactly one case.
    // Only the Citizen who owns the case can call this.
    // ─────────────────────────────────────────────────────────────────────────────
    @GetMapping("/case/{caseId}")
    @PreAuthorize("hasRole('CITIZEN')")
    public List<MatchResponse> getMatchesForCase(
            @PathVariable Long caseId,
            @AuthenticationPrincipal User currentUser) {
        return matchService.getMatchesForCase(caseId, currentUser);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET /matches/me
    // Returns matches scoped to the calling user:
    //   Citizens   → all matches across their cases
    //   Lawyers/NGOs → matches where they are the assigned provider
    // ─────────────────────────────────────────────────────────────────────────────
    @GetMapping("/me")
    public List<MatchResponse> getMyMatches(@AuthenticationPrincipal User currentUser) {
        return matchService.getMyMatches(currentUser);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET /matches/{matchId}
    // Returns a single match by ID.
    // Service layer enforces that only the case owner or the matched provider
    // can read the match (throws 403 otherwise).
    // ─────────────────────────────────────────────────────────────────────────────
    @GetMapping("/{matchId}")
    public MatchResponse getMatchById(
            @PathVariable Long matchId,
            @AuthenticationPrincipal User currentUser) {
        return matchService.getMatchById(matchId, currentUser);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // PUT /matches/{matchId}/accept
    // Called by the Citizen to finalise the matched Lawyer/NGO for their case.
    // Flow: PENDING → ACCEPTED (and all other PENDING matches for the same case
    // are automatically set to REJECTED by the service layer).
    //
    // FIX: Added @PreAuthorize so only CITIZEN can call this endpoint.
    // Previously there was no role guard, meaning any authenticated user could hit
    // this endpoint. The service also validates that the Citizen owns the case.
    // ─────────────────────────────────────────────────────────────────────────────
    @PutMapping("/{matchId}/accept")
    @PreAuthorize("hasRole('CITIZEN')")
    public MatchResponse acceptMatch(
            @PathVariable Long matchId,
            @AuthenticationPrincipal User currentUser) {
        return matchService.acceptMatch(matchId, currentUser);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // PUT /matches/{matchId}/reject
    // Can be called by either party to cancel a match:
    //   Citizen    → dismisses a match they do not want
    //   Lawyer/NGO → declines the case before the Citizen has accepted
    // Flow: PENDING → REJECTED
    //
    // FIX: Added @PreAuthorize to restrict to CITIZEN, LAWYER, and NGO.
    // The service layer does a secondary check to ensure the caller is actually
    // the case owner or the matched provider (throws 403 otherwise).
    // ─────────────────────────────────────────────────────────────────────────────
    @PutMapping("/{matchId}/reject")
    @PreAuthorize("hasAnyRole('CITIZEN','LAWYER','NGO')")
    public MatchResponse rejectMatch(
            @PathVariable Long matchId,
            @AuthenticationPrincipal User currentUser) {
        return matchService.rejectMatch(matchId, currentUser);
    }

    // NOTE: The expressInterest endpoint has been removed from this flow.
    // The simplified flow is: PENDING → ACCEPTED (Citizen accepts directly)
    //                      or PENDING → REJECTED (either party rejects).
    // The INTERESTED intermediate state and its endpoint are no longer needed.
}
