package com.teamthree.legalaid.dashboard.controller;

import com.teamthree.legalaid.dashboard.dto.UserDashboardDTO;
import com.teamthree.legalaid.dashboard.service.UserDashboardService;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class UserDashboardController {

    private final UserDashboardService userDashboardService;
    private final UserRepository userRepository;

    private User resolveUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + userDetails.getUsername()));
    }

    @GetMapping("/overview")
    public ResponseEntity<UserDashboardDTO> getDashboardOverview(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userDashboardService.getDashboardOverview(resolveUser(userDetails)));
    }

    @GetMapping("/cases/my-cases")
    public ResponseEntity<?> getMyCases(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userDashboardService.getMyCases(resolveUser(userDetails)));
    }

    @GetMapping("/cases/active")
    public ResponseEntity<?> getActiveCases(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userDashboardService.getActiveCases(resolveUser(userDetails)));
    }

    @GetMapping("/cases/resolved")
    public ResponseEntity<?> getResolvedCases(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userDashboardService.getResolvedCases(resolveUser(userDetails)));
    }

    @GetMapping("/assigned-lawyer")
    public ResponseEntity<?> getAssignedLawyer(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userDashboardService.getAssignedLawyerName(resolveUser(userDetails)));
    }

    @GetMapping("/recent-activities")
    public ResponseEntity<?> getRecentActivities(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userDashboardService.getRecentActivities(resolveUser(userDetails)));
    }
}