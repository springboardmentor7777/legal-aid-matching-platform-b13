package com.milestone.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.milestone.backend.dto.UpdateProfileRequest;
import com.milestone.backend.entity.User;
import com.milestone.backend.repository.UserRepository;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getProfile(Authentication authentication) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("DEBUG: I am looking for email -> [" + email + "]"));

        // Safely map ONLY the fields the frontend needs. 
        // This prevents the JSON converter from crashing on missing lawyer/ngo profiles!
        Map<String, Object> safeProfile = new HashMap<>();
        safeProfile.put("id", user.getId());
        safeProfile.put("name", user.getName());
        safeProfile.put("email", user.getEmail());
        safeProfile.put("role", user.getRole());
        safeProfile.put("is_verified", user.getIsVerified());
        return ResponseEntity.ok(safeProfile);
    }

    @PutMapping("/update")
    public User updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null) {
            user.setName(request.getName());
        }

        return userRepository.save(user);
    }
}