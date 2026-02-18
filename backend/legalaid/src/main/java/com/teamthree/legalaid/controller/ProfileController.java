package com.teamthree.legalaid.controller;

import com.teamthree.legalaid.dto.UpdateProfileRequest;
import com.teamthree.legalaid.dto.UserProfileResponse;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    /**
     * Get current user's profile
     * Endpoint: GET /profile/me
     * Requires: Valid JWT token
     */
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(@AuthenticationPrincipal User user) {
        UserProfileResponse profile = profileService.getProfile(user);
        return ResponseEntity.ok(profile);
    }

    /**
     * Update current user's profile
     * Endpoint: PUT /profile/update
     * Requires: Valid JWT token
     */
    @PutMapping("/update")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody UpdateProfileRequest request) {
        
        UserProfileResponse updatedProfile = profileService.updateProfile(user, request);
        return ResponseEntity.ok(updatedProfile);
    }

    /**
     * Get profile by user ID (optional - for admin)
     * Endpoint: GET /profile/{userId}
     * Requires: ADMIN role
     */
    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileResponse> getProfileByUserId(@PathVariable Long userId) {
        UserProfileResponse profile = profileService.getProfileByUserId(userId);
        return ResponseEntity.ok(profile);
    }

    /**
     * Delete user account (optional)
     * Endpoint: DELETE /profile/delete
     * Requires: Valid JWT token
     */
    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, String>> deleteAccount(@AuthenticationPrincipal User user) {
        profileService.deleteAccount(user);
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Account deleted successfully"
        ));
    }

    /**
     * Change password
     * Endpoint: POST /profile/change-password
     * Requires: Valid JWT token
     */
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> passwordRequest) {
        
        String oldPassword = passwordRequest.get("oldPassword");
        String newPassword = passwordRequest.get("newPassword");
        
        profileService.changePassword(user, oldPassword, newPassword);
        
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Password changed successfully"
        ));
    }
}