package com.legalmatch.backend.controller;

import com.legalmatch.backend.dto.OnboardingRequest;
import com.legalmatch.backend.service.OnboardingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class OnboardingController {

    private final OnboardingService onboardingService;

    @PutMapping("/onboarding")
    public ResponseEntity<?> completeOnboarding(
            @RequestBody OnboardingRequest request,
            Authentication authentication) {

        onboardingService.completeOnboarding(request, authentication.getName());
        return ResponseEntity.ok(Map.of("message", "Onboarding completed successfully"));
    }
}
