package com.legalmatch.backend.controller;

import com.legalmatch.backend.entity.*;
import com.legalmatch.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DashboardController {

    private final UserRepository userRepository;
    private final MatchRepository matchRepository;

    @GetMapping("/lawyer/dashboard")
    public ResponseEntity<?> lawyerDashboard(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        long totalClients = matchRepository.countByProviderAndStatus(user, MatchStatus.ACCEPTED);
        long pendingRequests = matchRepository.countByProviderAndStatus(user, MatchStatus.PENDING);

        List<MatchEntity> allMatches = matchRepository.findByProviderOrderByCreatedAtDesc(user);
        long activeCases = allMatches.stream()
                .filter(m -> m.getStatus() == MatchStatus.ACCEPTED)
                .count();

        // Build recent activity from matches
        List<Map<String, Object>> recentActivity = new ArrayList<>();
        for (MatchEntity match : allMatches.stream().limit(10).toList()) {
            Map<String, Object> activity = new HashMap<>();
            activity.put("title", "Match " + match.getStatus().name().toLowerCase() +
                    " — " + match.getLegalCase().getCaseType());
            activity.put("message", "Case from " + match.getCitizen().getName());
            activity.put("createdAt", match.getCreatedAt().toString());
            recentActivity.add(activity);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("totalClients", totalClients);
        response.put("activeCases", activeCases);
        response.put("pendingRequests", pendingRequests);
        response.put("resolved", 0);
        response.put("recentActivity", recentActivity);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/ngo/dashboard")
    public ResponseEntity<?> ngoDashboard(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        long totalBeneficiaries = matchRepository.countByProviderAndStatus(user, MatchStatus.ACCEPTED);
        long pendingRequests = matchRepository.countByProviderAndStatus(user, MatchStatus.PENDING);

        List<MatchEntity> allMatches = matchRepository.findByProviderOrderByCreatedAtDesc(user);
        long activeCases = allMatches.stream()
                .filter(m -> m.getStatus() == MatchStatus.ACCEPTED)
                .count();

        List<Map<String, Object>> recentActivity = new ArrayList<>();
        for (MatchEntity match : allMatches.stream().limit(10).toList()) {
            Map<String, Object> activity = new HashMap<>();
            activity.put("title", "Match " + match.getStatus().name().toLowerCase() +
                    " — " + match.getLegalCase().getCaseType());
            activity.put("message", "Case from " + match.getCitizen().getName());
            activity.put("createdAt", match.getCreatedAt().toString());
            recentActivity.add(activity);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("totalBeneficiaries", totalBeneficiaries);
        response.put("activeCases", activeCases);
        response.put("pendingRequests", pendingRequests);
        response.put("resolved", 0);
        response.put("recentActivity", recentActivity);

        return ResponseEntity.ok(response);
    }
}
