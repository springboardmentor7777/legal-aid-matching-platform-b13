package com.milestone.backend.service;

import com.milestone.backend.dto.MatchResponse;

import java.util.List;

public interface MatchService {

    List<MatchResponse> generateMatches(Long caseId);

    List<MatchResponse> getMyMatches(Long userId);

    MatchResponse acceptMatch(Long matchId);

    MatchResponse rejectMatch(Long matchId);
}