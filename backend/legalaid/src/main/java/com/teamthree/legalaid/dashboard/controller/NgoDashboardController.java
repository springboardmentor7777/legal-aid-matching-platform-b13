package com.teamthree.legalaid.dashboard.controller;

import com.teamthree.legalaid.dashboard.dto.NgoDashboardDTO;
import com.teamthree.legalaid.dashboard.service.NgoDashboardService;
import com.teamthree.legalaid.dto.CaseDTO;
import com.teamthree.legalaid.dto.LawyerDTO;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ngo/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('NGO')")
public class NgoDashboardController {

    private final NgoDashboardService ngoDashboardService;
    private final UserRepository userRepository;

    private User resolveUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + userDetails.getUsername()));
    }

    @GetMapping("/overview")
    public ResponseEntity<NgoDashboardDTO> getDashboardOverview(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ngoDashboardService.getDashboardOverview(resolveUser(userDetails)));
    }

    @GetMapping("/cases/assigned")
    public ResponseEntity<List<CaseDTO>> getAssignedCases(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ngoDashboardService.getAssignedCases(resolveUser(userDetails)));
    }

    @GetMapping("/cases/completed")
    public ResponseEntity<List<CaseDTO>> getCompletedCases(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ngoDashboardService.getCompletedCases(resolveUser(userDetails)));
    }

    @GetMapping("/lawyers/available")
    public ResponseEntity<List<LawyerDTO>> getAvailableLawyers() {
        return ResponseEntity.ok(ngoDashboardService.getAvailableLawyers());
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getOrganizationStatistics(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ngoDashboardService.getOrganizationStatistics(resolveUser(userDetails)));
    }

    @GetMapping("/upcoming-hearings")
    public ResponseEntity<List<CaseDTO>> getUpcomingHearings(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ngoDashboardService.getUpcomingHearings(resolveUser(userDetails)));
    }
}