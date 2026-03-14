package com.milestone.backend.service;

import com.milestone.backend.dto.MatchResponse;
import java.util.List;

public interface MatchingService {

    // Generate matches for a specific case
    List<MatchResponse> generateMatchesForCase(Long caseId);

    // Get matches for the logged-in provider (Lawyer/NGO)
    List<MatchResponse> getMatchesForProvider(Long providerId);

    // Accept a match
    MatchResponse acceptMatch(Long matchId);

    // Reject a match
    MatchResponse rejectMatch(Long matchId);
}