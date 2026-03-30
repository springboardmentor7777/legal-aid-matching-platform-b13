package com.milestone.backend.controller;

import com.milestone.backend.dto.*;
import com.milestone.backend.service.AdminService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    // 🔹 GET /admin/users
    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDto>> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // 🔹 PUT /admin/users/{id}/status
    @PutMapping("/users/{id}/status")
    public ResponseEntity<String> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {

        adminService.updateUserStatus(id, request);
        return ResponseEntity.ok("User status updated successfully");
    }

    // 🔹 GET /admin/verifications
    @GetMapping("/verifications")
    public ResponseEntity<List<VerificationDto>> getVerifications() {
        return ResponseEntity.ok(adminService.getPendingVerifications());
    }

    // 🔹 PUT /admin/verify/lawyer/{id}
    @PutMapping("/verify/lawyer/{id}")
    public ResponseEntity<String> verifyLawyer(@PathVariable Long id) {
        adminService.verifyLawyer(id);
        return ResponseEntity.ok("Lawyer verified successfully");
    }

    // 🔹 PUT /admin/verify/ngo/{id}
    @PutMapping("/verify/ngo/{id}")
    public ResponseEntity<String> verifyNgo(@PathVariable Long id) {
        adminService.verifyNgo(id);
        return ResponseEntity.ok("NGO verified successfully");
    }

    // 🔹 GET /admin/cases
    @GetMapping("/cases")
    public ResponseEntity<List<CaseResponse>> getCases() {
        return ResponseEntity.ok(adminService.getAllCases());
    }

    // 🔹 GET /admin/system/logs
    @GetMapping("/system/logs")
    public ResponseEntity<List<SystemLogDto>> getLogs() {
        return ResponseEntity.ok(adminService.getSystemLogs());
    }

    // 🔹 GET /admin/health
    @GetMapping("/health")
    public ResponseEntity<SystemHealthDto> getHealth() {
        return ResponseEntity.ok(adminService.getSystemHealth());
    }
}