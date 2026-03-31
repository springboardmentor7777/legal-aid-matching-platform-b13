package com.teamthree.legalaid.controller;

import com.teamthree.legalaid.dto.UpdateProfileRequest;
import com.teamthree.legalaid.dto.UserProfileResponse;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.security.CustomUserDetails;
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
     * GET /profile/me
     * Fix: JWT filter stores CustomUserDetails as the principal (not Spring's User).
     * Changed @AuthenticationPrincipal type to CustomUserDetails and extract User via .getUser().
     */
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(
            @AuthenticationPrincipal CustomUserDetails principal) {

        User user = principal.getUser();
        UserProfileResponse profile = profileService.getProfile(user);
        return ResponseEntity.ok(profile);
    }

    /**
     * PUT /profile/update
     * Fix: Same principal type fix. Also supports phone/location fields via UpdateProfileRequest.
     */
    @PutMapping("/update")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestBody UpdateProfileRequest request) {

        User user = principal.getUser();
        UserProfileResponse updatedProfile = profileService.updateProfile(user, request);
        return ResponseEntity.ok(updatedProfile);
    }

    /**
     * GET /profile/{userId}
     * Public within authenticated scope — no principal needed.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileResponse> getProfileByUserId(@PathVariable Long userId) {
        UserProfileResponse profile = profileService.getProfileByUserId(userId);
        return ResponseEntity.ok(profile);
    }

    /**
     * DELETE /profile/delete
     * Fix: Same principal type fix.
     */
    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, String>> deleteAccount(
            @AuthenticationPrincipal CustomUserDetails principal) {

        User user = principal.getUser();
        profileService.deleteAccount(user);
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Account deleted successfully"
        ));
    }

    /**
     * POST /profile/change-password
     * Fix: Same principal type fix.
     */
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestBody Map<String, String> passwordRequest) {

        User user = principal.getUser();
        String oldPassword = passwordRequest.get("oldPassword");
        String newPassword = passwordRequest.get("newPassword");

        profileService.changePassword(user, oldPassword, newPassword);

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Password changed successfully"
        ));
    }
}
