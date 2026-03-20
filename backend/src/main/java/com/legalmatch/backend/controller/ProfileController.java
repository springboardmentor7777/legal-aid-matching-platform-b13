package com.legalmatch.backend.controller;

import com.legalmatch.backend.dto.ProfileResponse;
import com.legalmatch.backend.dto.UpdateProfileRequest;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ProfileResponse getProfile(Authentication authentication) {
        System.out.println("Authentication object:"+authentication);

        
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new ProfileResponse(
                user.getUsername(),
                user.getEmail(),
                user.getRole()!=null? user.getRole().name():null,
                user.isEnabled()
        );
    }

    @PutMapping("/update")
    public ProfileResponse updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request) {

        
                String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update only allowed fields
        if (request.getUsername() != null) {
            user.setUsername(request.getUsername());
        }

        userRepository.save(user);

        return new ProfileResponse(
                user.getUsername(),
                user.getEmail(),
                user.getRole()!=null? user.getRole().name():null,
                user.isEnabled()
        );
    }
}
