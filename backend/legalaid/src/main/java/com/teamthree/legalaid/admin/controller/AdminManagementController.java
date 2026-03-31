package com.teamthree.legalaid.admin.controller;
 
import com.teamthree.legalaid.admin.dto.*;
import com.teamthree.legalaid.admin.service.AdminManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
 
import java.util.List;
import java.util.Map;
 
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminManagementController {
 
    private final AdminManagementService adminManagementService;
 
    // ─── User Management ──────────────────────────────────────────────────────
 
    /** GET /admin/users — list all users with profile info */
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDTO>> getAllUsers() {
        return ResponseEntity.ok(adminManagementService.getAllUsers());
    }
 
    /** PUT /admin/users/{id}/status — enable or disable a user account */
    @PutMapping("/users/{id}/status")
    public ResponseEntity<Map<String, Object>> updateUserStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest request) {
        return ResponseEntity.ok(adminManagementService.updateUserStatus(id, request.isEnabled()));
    }
 
    // ─── Verification Management ──────────────────────────────────────────────
 
    /** GET /admin/verifications — list all pending lawyer + NGO verifications */
    @GetMapping("/verifications")
    public ResponseEntity<PendingVerificationsDTO> getPendingVerifications() {
        return ResponseEntity.ok(adminManagementService.getPendingVerifications());
    }
 
    /** PUT /admin/verify/lawyer/{id} — verify or reject a lawyer profile */
    @PutMapping("/verify/lawyer/{id}")
    public ResponseEntity<Map<String, Object>> verifyLawyer(
            @PathVariable Long id,
            @RequestBody VerifyRequest request) {
        return ResponseEntity.ok(adminManagementService.verifyLawyer(id, request.isVerified()));
    }
 
    /** PUT /admin/verify/ngo/{id} — verify or reject an NGO profile */
    @PutMapping("/verify/ngo/{id}")
    public ResponseEntity<Map<String, Object>> verifyNgo(
            @PathVariable Long id,
            @RequestBody VerifyRequest request) {
        return ResponseEntity.ok(adminManagementService.verifyNgo(id, request.isVerified()));
    }
 
    // ─── Case Monitoring ──────────────────────────────────────────────────────
 
    /** GET /admin/cases — list all cases with user and assignment details */
    @GetMapping("/cases")
    public ResponseEntity<List<AdminCaseDTO>> getAllCases() {
        return ResponseEntity.ok(adminManagementService.getAllCases());
    }
 
    // ─── System Monitoring ────────────────────────────────────────────────────
 
    /** GET /admin/system/logs — recent activity logs across the platform */
    @GetMapping("/system/logs")
    public ResponseEntity<List<SystemLogDTO>> getSystemLogs() {
        return ResponseEntity.ok(adminManagementService.getSystemLogs());
    }
 
    /** GET /admin/health — system health check with DB and service stats */
    @GetMapping("/health")
    public ResponseEntity<SystemHealthDTO> getSystemHealth() {
        return ResponseEntity.ok(adminManagementService.getSystemHealth());
    }
}
 