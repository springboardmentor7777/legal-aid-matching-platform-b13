package com.teamthree.legalaid.dashboard.controller;

import com.teamthree.legalaid.dashboard.dto.NgoDashboardDTO;
import com.teamthree.legalaid.dashboard.service.NgoDashboardService;
import com.teamthree.legalaid.dto.CaseDTO;
import com.teamthree.legalaid.dto.LawyerDTO;
import com.teamthree.legalaid.entity.User;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ngo/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('NGO')")
public class NgoDashboardController {

    private final NgoDashboardService ngoDashboardService;

    @GetMapping("/overview")
    public ResponseEntity<NgoDashboardDTO> getDashboardOverview(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ngoDashboardService.getDashboardOverview(user));
    }

    @GetMapping("/cases/assigned")
    public ResponseEntity<List<CaseDTO>> getAssignedCases(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ngoDashboardService.getAssignedCases(user));
    }

    @GetMapping("/cases/completed")
    public ResponseEntity<List<CaseDTO>> getCompletedCases(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ngoDashboardService.getCompletedCases(user));
    }

    @GetMapping("/lawyers/available")
    public ResponseEntity<List<LawyerDTO>> getAvailableLawyers() {
        return ResponseEntity.ok(ngoDashboardService.getAvailableLawyers());
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getOrganizationStatistics(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ngoDashboardService.getOrganizationStatistics(user));
    }

    @GetMapping("/upcoming-hearings")
    public ResponseEntity<List<CaseDTO>> getUpcomingHearings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ngoDashboardService.getUpcomingHearings(user));
    }
}