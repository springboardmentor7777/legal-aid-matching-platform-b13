package com.milestone.backend.controller;

import com.milestone.backend.dto.MatchResponse;
import com.milestone.backend.entity.User;
import com.milestone.backend.repository.UserRepository;
import com.milestone.backend.service.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchingService matchingService;
    private final UserRepository userRepository;

    @GetMapping("/generate/{caseId}")
    public List<MatchResponse> getRecommendations(@PathVariable Long caseId) {
        return matchingService.getPotentialProviders(caseId);
    }

    @PostMapping("/request/{caseId}/{providerId}")
    public MatchResponse createRequest(@PathVariable Long caseId, @PathVariable Long providerId) {
        return matchingService.createMatchRequest(caseId, providerId);
    }

    @GetMapping("/my")
    public List<MatchResponse> getMyMatches(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "User not found"));
        return matchingService.getMatchesForUser(user);
    }

    @PutMapping("/{matchId}/accept")
    public MatchResponse acceptMatch(@PathVariable Long matchId) {
        return matchingService.acceptMatch(matchId);
    }

    @PutMapping("/{matchId}/reject")
    public MatchResponse rejectMatch(@PathVariable Long matchId) {
        return matchingService.rejectMatch(matchId);
    }
}