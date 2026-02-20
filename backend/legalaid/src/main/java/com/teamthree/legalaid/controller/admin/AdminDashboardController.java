package com.teamthree.legalaid.controller.admin;

import com.teamthree.legalaid.dto.DashboardStatsDTO;
import com.teamthree.legalaid.service.admin.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(adminDashboardService.getDashboardStats());
    }

    @GetMapping("/recent-users")
    public ResponseEntity<?> getRecentUsers() {
        return ResponseEntity.ok(adminDashboardService.getRecentUsers());
    }

    @GetMapping("/recent-cases")
    public ResponseEntity<?> getRecentCases() {
        return ResponseEntity.ok(adminDashboardService.getRecentCases());
    }

    @GetMapping("/users-by-role")
    public ResponseEntity<Map<String, Long>> getUsersByRole() {
        return ResponseEntity.ok(adminDashboardService.getUsersByRole());
    }

    @GetMapping("/system-health")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        return ResponseEntity.ok(adminDashboardService.getSystemHealth());
    }
}