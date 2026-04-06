package com.legalmatch.backend.controller;

import com.legalmatch.backend.dto.ManageMatchRequest;
import com.legalmatch.backend.dto.MatchResponse;
import com.legalmatch.backend.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    // ✅ Generate matches
    @PostMapping("/generate/{caseId}")
    public ResponseEntity<List<MatchResponse>> generateMatches(
            @PathVariable Long caseId,
            Authentication authentication) {

        return ResponseEntity.ok(
                matchService.generateMatches(caseId, authentication.getName())
        );
    }

    // ✅ Get my matches
    @GetMapping("/my")
    public ResponseEntity<List<MatchResponse>> getMyMatches(
            Authentication authentication) {

        return ResponseEntity.ok(
                matchService.getMyMatches(authentication.getName())
        );
    }

    // ✅ Get active (ACCEPTED) matches for providers
    @GetMapping("/my-active")
    @PreAuthorize("hasRole('LAWYER') or hasRole('NGO')")
    public ResponseEntity<List<MatchResponse>> getMyActiveMatches(
            Authentication authentication) {

        return ResponseEntity.ok(
                matchService.getActiveMatches(authentication.getName())
        );
    }

    // ✅ Accept match
    @PutMapping("/{matchId}/accept")
    public ResponseEntity<MatchResponse> acceptMatch(
            @PathVariable Long matchId,
            Authentication authentication) {

        return ResponseEntity.ok(
                matchService.acceptMatch(matchId, authentication.getName())
        );
    }

    // ✅ Reject match
    @PutMapping("/{matchId}/reject")
    public ResponseEntity<MatchResponse> rejectMatch(
            @PathVariable Long matchId,
            Authentication authentication) {

        return ResponseEntity.ok(
                matchService.rejectMatch(matchId, authentication.getName())
        );
    }

    // ✅ Manage match (update status + notes) — providers only
    @PutMapping("/{matchId}/manage")
    @PreAuthorize("hasRole('LAWYER') or hasRole('NGO')")
    public ResponseEntity<MatchResponse> manageMatch(
            @PathVariable Long matchId,
            @RequestBody ManageMatchRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                matchService.manageMatch(
                        matchId,
                        authentication.getName(),
                        request.getInternalStatus(),
                        request.getProviderNotes()
                )
        );
    }
}