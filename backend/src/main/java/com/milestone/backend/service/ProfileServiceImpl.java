package com.milestone.backend.service;

import com.milestone.backend.entity.User;
import com.milestone.backend.repository.UserRepository;
import com.milestone.backend.dto.ProfileResponseDto;
import com.milestone.backend.dto.ProfileUpdateDto;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.milestone.backend.entity.Role;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;

    @Override
    public ProfileResponseDto getMyProfile() {

        User user = getAuthenticatedUser();

        ProfileResponseDto dto = new ProfileResponseDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());

        // 🔹 If user is LAWYER
        if (user.getRole() == Role.LAWYER && user.getLawyerProfile() != null) {
            dto.setSpecialization(user.getLawyerProfile().getSpecialization());
            dto.setExperience(user.getLawyerProfile().getExperience());
            dto.setLocation(user.getLawyerProfile().getLocation());
        }

        // 🔹 If user is NGO
        if (user.getRole() == Role.NGO && user.getNgoProfile() != null) {
            dto.setOrganizationName(user.getNgoProfile().getOrganizationName());
            dto.setServiceArea(user.getNgoProfile().getServiceArea());
            dto.setLocation(user.getNgoProfile().getLocation());
        }

        return dto;
    }

    @Override
    @Transactional
    public ProfileResponseDto updateProfile(ProfileUpdateDto dto) {

        User user = getAuthenticatedUser();

        // Update the basic user info
        user.setName(dto.getName());

        // 🔹 Check if they are an NGO and update their location
        if (user.getRole() == Role.NGO && user.getNgoProfile() != null) {
            if (dto.getLocation() != null) {
                user.getNgoProfile().setLocation(dto.getLocation());
            }
        }

        userRepository.save(user);

        return getMyProfile();
    }

    // 🔹 ADDED THIS NEW METHOD: For the Admin Verification API
    @Override
    @Transactional
    public Map<String, Object> updateUserVerification(String email, boolean isVerified) {

        // 1. Find the user from the database
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // 2. Update the verified status and save (UPDATED for Boolean wrapper)
        user.setIsVerified(isVerified);
        userRepository.save(user);

        // 3. Build the exact JSON response Sandeep asked for
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User verification status updated successfully.");
        response.put("email", user.getEmail());

        // (UPDATED for Boolean wrapper)
        response.put("is_verified", user.getIsVerified());

        return response;
    }

    private User getAuthenticatedUser() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public List<ProfileResponseDto> getAllProfiles() {

        List<User> allUsers = userRepository.findAll();

        return allUsers.stream().map(user -> {
            ProfileResponseDto dto = new ProfileResponseDto();
            dto.setId(user.getId());
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            dto.setRole(user.getRole().name());
            
            // (UPDATED for Boolean wrapper) Ensure the frontend sees the status!
            // Note: If your DTO expects a primitive boolean, keep it as setVerified. 
            // If the DTO expects a Boolean object, make sure the DTO has it defined properly.
            dto.setVerified(user.getIsVerified() != null ? user.getIsVerified() : false); 

            // Map Lawyer specifics if they exist
            if (user.getRole() == Role.LAWYER && user.getLawyerProfile() != null) {
                dto.setSpecialization(user.getLawyerProfile().getSpecialization());
                dto.setExperience(user.getLawyerProfile().getExperience());
                dto.setLocation(user.getLawyerProfile().getLocation());
            }

            // Map NGO specifics if they exist
            if (user.getRole() == Role.NGO && user.getNgoProfile() != null) {
                dto.setOrganizationName(user.getNgoProfile().getOrganizationName());
                dto.setServiceArea(user.getNgoProfile().getServiceArea());
                dto.setLocation(user.getNgoProfile().getLocation());
            }

            return dto;
        }).collect(Collectors.toList());
    }
}