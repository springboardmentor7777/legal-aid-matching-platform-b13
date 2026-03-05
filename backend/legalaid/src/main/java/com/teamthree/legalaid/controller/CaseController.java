package com.teamthree.legalaid.controller;

import com.teamthree.legalaid.dto.CaseDTO;
import com.teamthree.legalaid.dto.CreateCaseRequest;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.repository.UserRepository;
import com.teamthree.legalaid.service.CaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
public class CaseController {

    private final CaseService caseService;
    private final UserRepository userRepository;

    // POST /api/cases — Submit a new case (USER role only)
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createCase(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody CreateCaseRequest request) {

        User user = resolveUser(principal);
        CaseDTO created = caseService.createCase(user, request);
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Case submitted successfully",
            "case", created
        ));
    }

    // GET /api/cases/my — Get all cases for the logged-in user (USER role only)
    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<CaseDTO>> getMyCases(
            @AuthenticationPrincipal UserDetails principal) {

        User user = resolveUser(principal);
        return ResponseEntity.ok(caseService.getUserCases(user));
    }

    // GET /api/cases/{id} — Get a single case by ID (any authenticated user)
    @GetMapping("/{id}")
    public ResponseEntity<CaseDTO> getCaseById(@PathVariable Long id) {
        return ResponseEntity.ok(caseService.getCaseById(id));
    }

    // Helper: resolve User entity from JWT principal
    private User resolveUser(UserDetails principal) {
        return userRepository.findByEmail(principal.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found: " + principal.getUsername()));
    }
}