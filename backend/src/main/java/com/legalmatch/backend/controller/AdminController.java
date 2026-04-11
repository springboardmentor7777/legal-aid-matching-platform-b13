package com.legalmatch.backend.controller;

import com.legalmatch.backend.entity.AuditLog;
import com.legalmatch.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST API for admin operations: analytics, provider verification,
 * user management, audit logs, and case monitoring.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        return ResponseEntity.ok(adminService.getAdminStats());
    }

    @GetMapping("/export/cases")
    public ResponseEntity<byte[]> exportCasesCsv() {
        String csv = adminService.exportCasesToCsv();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=cases_report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv.getBytes());
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/pending-verifications")
    public ResponseEntity<List<Map<String, Object>>> getPendingVerifications() {
        return ResponseEntity.ok(adminService.getPendingVerifications());
    }

    @PutMapping("/verify/{userId}")
    public ResponseEntity<Map<String, Object>> verifyProvider(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "true") boolean approve) {
        return ResponseEntity.ok(adminService.verifyProvider(userId, approve));
    }

    @PutMapping("/users/{userId}/suspend")
    public ResponseEntity<Map<String, Object>> suspendUser(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.toggleSuspendUser(userId));
    }

    @GetMapping("/logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(adminService.getRecentLogs());
    }

    @GetMapping("/cases")
    public ResponseEntity<List<Map<String, Object>>> getAllCases() {
        return ResponseEntity.ok(adminService.getAllCasesForAdmin());
    }
}
