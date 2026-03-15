package com.milestone.backend.controller;

import com.milestone.backend.dto.MatchResponse;
import com.milestone.backend.service.MatchService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/matches")
public class MatchController {

    private final MatchService matchService;
    public MatchController(MatchService matchService) { this.matchService = matchService; }

    @PostMapping("/generate/{caseId}")
    public List<MatchResponse> generateMatches(@PathVariable Long caseId) { return matchService.generateMatches(caseId); }

    @GetMapping("/my/{userId}")
    public List<MatchResponse> getMyMatches(@PathVariable Long userId) { return matchService.getMyMatches(userId); }

    @PutMapping("/{matchId}/accept")
    public MatchResponse acceptMatch(@PathVariable Long matchId) { return matchService.acceptMatch(matchId); }

    @PutMapping("/{matchId}/reject")
    public MatchResponse rejectMatch(@PathVariable Long matchId) { return matchService.rejectMatch(matchId); }
}