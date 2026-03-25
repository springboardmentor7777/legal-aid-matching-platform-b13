package com.milestone.backend.controller;

import com.milestone.backend.dto.MatchResponse;
import com.milestone.backend.entity.User;
import com.milestone.backend.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @PostMapping("/generate/{caseId}")
    public List<MatchResponse> generateMatches(@PathVariable Long caseId) {
        return matchService.generateMatches(caseId);
    }

    @GetMapping("/me")
    public List<MatchResponse> getMyMatches(@AuthenticationPrincipal User currentUser) {
        return matchService.getMyMatches(currentUser);
    }

    @GetMapping("/{matchId}")
    public MatchResponse getMatchById(@PathVariable Long matchId, @AuthenticationPrincipal User currentUser) {
        return matchService.getMatchById(matchId, currentUser);
    }

    // NEW: Provider calls this to say "I am interested in taking this case"
    @PutMapping("/{matchId}/interest")
    public MatchResponse expressInterest(
            @PathVariable Long matchId,
            @AuthenticationPrincipal User currentUser) {
        return matchService.expressInterest(matchId, currentUser);
    }

    // UPDATED: Citizen calls this to finalize the lawyer they want
    @PutMapping("/{matchId}/accept")
    public MatchResponse acceptMatch(
            @PathVariable Long matchId,
            @AuthenticationPrincipal User currentUser) {
        return matchService.acceptMatch(matchId, currentUser);
    }

    // Citizen or Provider calls this to reject/cancel
    @PutMapping("/{matchId}/reject")
    public MatchResponse rejectMatch(
            @PathVariable Long matchId,
            @AuthenticationPrincipal User currentUser) {
        return matchService.rejectMatch(matchId, currentUser);
    }
}