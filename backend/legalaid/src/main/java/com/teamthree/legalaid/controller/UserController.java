package com.teamthree.legalaid.controller;

import com.teamthree.legalaid.dashboard.dto.UserDashboardDTO;
import com.teamthree.legalaid.dashboard.service.UserDashboardService;
import com.teamthree.legalaid.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class UserController {

    private final UserDashboardService userDashboardService;

    // Convenience redirect — same as /user/dashboard/overview
    @GetMapping("/dashboard")
    public ResponseEntity<UserDashboardDTO> userDashboard(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userDashboardService.getDashboardOverview(user));
    }
}