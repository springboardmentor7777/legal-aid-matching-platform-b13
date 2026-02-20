package com.teamthree.legalaid.controller.user;

import com.teamthree.legalaid.dto.UserDashboardDTO;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.service.user.UserDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class UserDashboardController {

    private final UserDashboardService userDashboardService;

    @GetMapping("/overview")
    public ResponseEntity<UserDashboardDTO> getDashboardOverview(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userDashboardService.getDashboardOverview(user));
    }

    @GetMapping("/cases/my-cases")
    public ResponseEntity<?> getMyCases(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userDashboardService.getMyCases(user));
    }

    @GetMapping("/cases/active")
    public ResponseEntity<?> getActiveCases(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userDashboardService.getActiveCases(user));
    }

    @GetMapping("/cases/resolved")
    public ResponseEntity<?> getResolvedCases(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userDashboardService.getResolvedCases(user));
    }

    @GetMapping("/assigned-lawyer")
    public ResponseEntity<?> getAssignedLawyer(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userDashboardService.getAssignedLawyerName(user));
    }

    @GetMapping("/recent-activities")
    public ResponseEntity<?> getRecentActivities(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userDashboardService.getRecentActivities(user));
    }
}