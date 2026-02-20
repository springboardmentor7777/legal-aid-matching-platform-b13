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

    
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(@AuthenticationPrincipal User user) {
        UserProfileResponse profile = profileService.getProfile(user);
        return ResponseEntity.ok(profile);
    }

    
    @PutMapping("/update")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody UpdateProfileRequest request) {
        
        UserProfileResponse updatedProfile = profileService.updateProfile(user, request);
        return ResponseEntity.ok(updatedProfile);
    }

    
    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileResponse> getProfileByUserId(@PathVariable Long userId) {
        UserProfileResponse profile = profileService.getProfileByUserId(userId);
        return ResponseEntity.ok(profile);
    }

   
    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, String>> deleteAccount(@AuthenticationPrincipal User user) {
        profileService.deleteAccount(user);
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Account deleted successfully"
        ));
    }

    
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