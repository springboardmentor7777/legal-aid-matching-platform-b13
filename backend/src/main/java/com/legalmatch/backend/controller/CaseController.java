package com.legalmatch.backend.controller;

import com.legalmatch.backend.dto.CreateCaseRequest;
import com.legalmatch.backend.service.CaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
<<<<<<< HEAD
@RequestMapping("/api/cases")
=======
@RequestMapping("api/cases")
>>>>>>> 4873db9f83eb616d40f282b063cf2164d13e5b7f
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
    public ResponseEntity<?> getMyCases(Authentication authentication) {
        return ResponseEntity.ok(
                caseService.getMyCases(authentication.getName())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCase(@PathVariable Long id) {
        return ResponseEntity.ok(caseService.getCaseById(id));
    }
}