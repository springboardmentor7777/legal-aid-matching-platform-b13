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

    @GetMapping("/my")
    public List<MatchResponse> getMyMatches(@AuthenticationPrincipal User currentUser) {
        return matchService.getMyMatches(currentUser);
    }

    @PutMapping("/{matchId}/accept")
    public MatchResponse acceptMatch(
            @PathVariable Long matchId,
            @AuthenticationPrincipal User currentUser) {

        return matchService.acceptMatch(matchId, currentUser);
    }

    @PutMapping("/{matchId}/reject")
    public MatchResponse rejectMatch(
            @PathVariable Long matchId,
            @AuthenticationPrincipal User currentUser) {

        return matchService.rejectMatch(matchId, currentUser);
    }
}