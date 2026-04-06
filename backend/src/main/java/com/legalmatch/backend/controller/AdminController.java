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

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    // ═══════════════════════════════════════
    // FEATURE 1: Admin Impact Analytics
    // ═══════════════════════════════════════

    /**
     * GET /api/admin/stats
     * Returns platform KPIs: totalUsers, totalCases, totalMatches, pendingVerifications, etc.
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        return ResponseEntity.ok(adminService.getAdminStats());
    }

    /**
     * GET /api/admin/export/cases
     * Downloads a CSV file of all system cases.
     */
    @GetMapping("/export/cases")
    public ResponseEntity<byte[]> exportCasesCsv() {
        String csv = adminService.exportCasesToCsv();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=cases_report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv.getBytes());
    }

    // ═══════════════════════════════════════
    // FEATURE 1 (cont): All Users
    // ═══════════════════════════════════════

    /**
     * GET /api/admin/users
     * Returns all platform users for the admin management table.
     */
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // ═══════════════════════════════════════
    // FEATURE 2: Provider Verification
    // ═══════════════════════════════════════

    /**
     * GET /api/admin/pending-verifications
     * Returns unverified lawyer + NGO profiles.
     */
    @GetMapping("/pending-verifications")
    public ResponseEntity<List<Map<String, Object>>> getPendingVerifications() {
        return ResponseEntity.ok(adminService.getPendingVerifications());
    }

    /**
     * PUT /api/admin/verify/{userId}?approve=true|false
     * Approves or rejects a provider's profile.
     */
    @PutMapping("/verify/{userId}")
    public ResponseEntity<Map<String, Object>> verifyProvider(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "true") boolean approve) {
        return ResponseEntity.ok(adminService.verifyProvider(userId, approve));
    }

    /**
     * PUT /api/admin/users/{userId}/suspend
     * Toggles the suspension status of a user account.
     */
    @PutMapping("/users/{userId}/suspend")
    public ResponseEntity<Map<String, Object>> suspendUser(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.toggleSuspendUser(userId));
    }

    // ═══════════════════════════════════════
    // FEATURE 3: Audit Logs
    // ═══════════════════════════════════════

    /**
     * GET /api/admin/logs
     * Returns the 50 most recent audit log entries.
     */
    @GetMapping("/logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(adminService.getRecentLogs());
    }

    // ═══════════════════════════════════════
    // Case Monitoring
    // ═══════════════════════════════════════

    /**
     * GET /api/admin/cases
     * Returns all cases for admin monitoring table.
     */
    @GetMapping("/cases")
    public ResponseEntity<List<Map<String, Object>>> getAllCases() {
        return ResponseEntity.ok(adminService.getAllCasesForAdmin());
    }
}
