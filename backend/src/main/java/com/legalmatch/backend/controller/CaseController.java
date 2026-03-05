package com.legalmatch.backend.controller;

import com.legalmatch.backend.dto.CreateCaseRequest;
import com.legalmatch.backend.service.CaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cases")
@RequiredArgsConstructor
public class CaseController {

    private final CaseService caseService;

    @PostMapping
    public ResponseEntity<?> createCase(
            @RequestBody CreateCaseRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                caseService.createCase(request, authentication.getName())
        );
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyCases(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        return ResponseEntity.ok(
                caseService.getMyCases(authentication.getName(), page, size)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCase(@PathVariable Long id) {
        return ResponseEntity.ok(caseService.getCaseById(id));
    }
}