package com.teamthree.legalaid.controller;

import com.teamthree.legalaid.dashboard.dto.LawyerDashboardDTO;
import com.teamthree.legalaid.dashboard.service.LawyerDashboardService;
import com.teamthree.legalaid.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/lawyer")
@RequiredArgsConstructor
@PreAuthorize("hasRole('LAWYER')")
public class LawyerController {

    private final LawyerDashboardService lawyerDashboardService;

    // Convenience redirect — same as /lawyer/dashboard/overview
    @GetMapping("/dashboard")
    public ResponseEntity<LawyerDashboardDTO> lawyerDashboard(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(lawyerDashboardService.getDashboardOverview(user));
    }
}