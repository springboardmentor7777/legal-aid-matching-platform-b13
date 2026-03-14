package com.milestone.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.milestone.backend.dto.ProfileResponseDto;
import com.milestone.backend.dto.ProfileUpdateRequest;
import com.milestone.backend.entity.User;
import com.milestone.backend.entity.Role;
import com.milestone.backend.entity.LawyerProfile;
import com.milestone.backend.entity.NgoProfile;
import com.milestone.backend.repository.UserRepository;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import com.milestone.backend.dto.VerificationRequest;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;
    private final com.milestone.backend.service.ProfileService profileService;

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getProfile(@AuthenticationPrincipal User user) {
        Map<String, Object> safeProfile = new HashMap<>();
        safeProfile.put("id", user.getId());
        safeProfile.put("name", user.getName());
        safeProfile.put("email", user.getEmail());
        safeProfile.put("role", user.getRole());
        safeProfile.put("is_verified", user.getIsVerified());

        if (user.getRole() == Role.LAWYER && user.getLawyerProfile() != null) {
            safeProfile.put("specialization", user.getLawyerProfile().getSpecialization());
            safeProfile.put("experience", user.getLawyerProfile().getExperience());
            safeProfile.put("location", user.getLawyerProfile().getLocation());
            safeProfile.put("isAvailable", user.getLawyerProfile().getIsAvailable());
        }

        if (user.getRole() == Role.NGO && user.getNgoProfile() != null) {
            safeProfile.put("organizationName", user.getNgoProfile().getOrganizationName());
            safeProfile.put("serviceArea", user.getNgoProfile().getServiceArea());
            // CHANGE 1: Added location to the NGO GET response
            safeProfile.put("location", user.getNgoProfile().getLocation());
            safeProfile.put("isAvailable", user.getNgoProfile().getIsAvailable());
        }

        return ResponseEntity.ok(safeProfile);
    }

    // CHANGE 2: Changed return type from ResponseEntity<User> to
    // ResponseEntity<Map<String, Object>>
    @PutMapping("/update")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @Valid @RequestBody ProfileUpdateRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Update basic user details
        if (request.getName() != null) {
            user.setName(request.getName());
        }

        // 2. Update Lawyer specific details
        if (user.getRole() == Role.LAWYER) {
            if (user.getLawyerProfile() == null) {
                LawyerProfile lawyerProfile = new LawyerProfile();
                lawyerProfile.setUser(user);
                user.setLawyerProfile(lawyerProfile);
            }
            if (request.getSpecialization() != null)
                user.getLawyerProfile().setSpecialization(request.getSpecialization());
            if (request.getExperience() != null)
                user.getLawyerProfile().setExperience(request.getExperience());
            if (request.getLocation() != null)
                user.getLawyerProfile().setLocation(request.getLocation());
             if(request.isAvailable() != true)
                user.getNgoProfile().setIsAvailable(request.isAvailable());
        }

        // 3. Update NGO specific details
        if (user.getRole() == Role.NGO) {
            if (user.getNgoProfile() == null) {
                NgoProfile ngoProfile = new NgoProfile();
                ngoProfile.setUser(user);
                user.setNgoProfile(ngoProfile);
            }
            if (request.getOrganizationName() != null)
                user.getNgoProfile().setOrganizationName(request.getOrganizationName());
            if (request.getServiceArea() != null)
                user.getNgoProfile().setServiceArea(request.getServiceArea());
            // CHANGE 3: Catch the location from the frontend and save it
            if (request.getLocation() != null)
                user.getNgoProfile().setLocation(request.getLocation());
            if(request.isAvailable() != true)
                user.getNgoProfile().setIsAvailable(request.isAvailable());
        }

        // Save the user to the database
        userRepository.save(user);

        // CHANGE 4: Return the exact same safe Map as the GET request instead of the
        // raw User
        return getProfile(user);
    }

    @GetMapping("/profiles/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProfileResponseDto>> getAllProfiles() {

        List<ProfileResponseDto> allProfiles = profileService.getAllProfiles();
        return ResponseEntity.ok(allProfiles);
    }

    @PutMapping("/profile/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> verifyUser(@RequestBody VerificationRequest request) {
        
        Map<String, Object> response = profileService.updateUserVerification(
                request.getEmail(), 
                request.isVerified()
        );
        
        return ResponseEntity.ok(response);
    }
}