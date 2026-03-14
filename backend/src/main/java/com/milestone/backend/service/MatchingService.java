package com.milestone.backend.service;

import com.milestone.backend.dto.MatchResponse;
import com.milestone.backend.entity.User;
import java.util.List;

public interface MatchingService {

    /**
     * DISCOVER:
     * Logic: Fetch Case -> Determine Role -> Calculate Scores -> Return List
     * This is transient; it DOES NOT save to the Match table.
     */
    List<MatchResponse> getPotentialProviders(Long caseId);

    /**
     * ACTION:
     * This is called when the Citizen selects a provider from the screen.
     * Logic: Save a new Match entity with status PENDING to the DB.
     */
    MatchResponse createMatchRequest(Long caseId, Long providerId);

    /**
     * RETRIEVE:
     * Fetch existing match records for the logged-in user's dashboard.
     */
    List<MatchResponse> getMatchesForUser(User user);

    /**
     * UPDATE:
     * Change status of an existing match to ACCEPTED.
     */
    MatchResponse acceptMatch(Long matchId);

    /**
     * UPDATE:
     * Change status of an existing match to REJECTED.
     */
    MatchResponse rejectMatch(Long matchId);
}