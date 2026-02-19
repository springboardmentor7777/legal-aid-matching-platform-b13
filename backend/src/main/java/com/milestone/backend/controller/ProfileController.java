package com.milestone.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.milestone.backend.dto.UpdateProfileRequest;
import com.milestone.backend.entity.User;
import com.milestone.backend.repository.UserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public User getProfile(Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
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
