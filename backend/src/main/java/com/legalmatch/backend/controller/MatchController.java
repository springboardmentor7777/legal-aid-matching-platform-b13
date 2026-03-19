package com.legalmatch.backend.controller;

import com.legalmatch.backend.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @PostMapping("/generate/{caseId}")
    public ResponseEntity<?> generateMatches(
            @PathVariable Long caseId,
            Authentication authentication) {
        return ResponseEntity.ok(
                matchService.generateMatches(caseId, authentication.getName())
        );
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyMatches(Authentication authentication) {
        return ResponseEntity.ok(
                matchService.getMyMatches(authentication.getName())
        );
    }

    @PutMapping("/{matchId}/accept")
    public ResponseEntity<?> acceptMatch(
            @PathVariable Long matchId,
            Authentication authentication) {
        return ResponseEntity.ok(
                matchService.acceptMatch(matchId, authentication.getName())
        );
    }

    @PutMapping("/{matchId}/reject")
    public ResponseEntity<?> rejectMatch(
            @PathVariable Long matchId,
            Authentication authentication) {
        return ResponseEntity.ok(
                matchService.rejectMatch(matchId, authentication.getName())
        );
    }
}
