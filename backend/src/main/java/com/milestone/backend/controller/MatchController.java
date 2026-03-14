package com.milestone.backend.controller;

import com.milestone.backend.dto.MatchResponse;
import com.milestone.backend.service.MatchingService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchingService matchingService;

    // Generate matches for a case
    @PostMapping("/generate/{caseId}")
    public List<MatchResponse> generateMatches(@PathVariable Long caseId) {
        return matchingService.generateMatchesForCase(caseId);
    }

    // Lawyer/NGO gets their matches
    @GetMapping("/provider/{providerId}")
    public List<MatchResponse> getProviderMatches(@PathVariable Long providerId) {
        return matchingService.getMatchesForProvider(providerId);
    }

    // Accept match
    @PutMapping("/{matchId}/accept")
    public MatchResponse acceptMatch(@PathVariable Long matchId) {
        return matchingService.acceptMatch(matchId);
    }

    // Reject match
    @PutMapping("/{matchId}/reject")
    public MatchResponse rejectMatch(@PathVariable Long matchId) {
        return matchingService.rejectMatch(matchId);
    }
}