package com.milestone.backend.service;

import com.milestone.backend.dto.MatchResponse;
import com.milestone.backend.entity.User;

import java.util.List;

public interface MatchService {

    List<MatchResponse> generateMatches(Long caseId);

    List<MatchResponse> getMyMatches(User user);

    MatchResponse acceptMatch(Long matchId, User currentUser);

    MatchResponse rejectMatch(Long matchId, User currentUser);

    MatchResponse getMatchById(Long matchId, User currentUser);

    MatchResponse expressInterest(Long matchId, User currentUser);
}