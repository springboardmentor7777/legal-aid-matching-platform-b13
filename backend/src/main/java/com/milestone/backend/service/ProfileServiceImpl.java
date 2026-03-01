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
    if(user.getRole() == Role.LAWYER && user.getLawyerProfile() != null) {

        dto.setSpecialization(
                user.getLawyerProfile().getSpecialization()
        );

        dto.setExperience(
                user.getLawyerProfile().getExperience()
        );

        dto.setLocation(
                user.getLawyerProfile().getLocation()
        );
    }

    // 🔹 If user is NGO
    if(user.getRole() == Role.NGO && user.getNgoProfile() != null) {

        dto.setOrganizationName(
                user.getNgoProfile().getOrganizationName()
        );

        dto.setServiceArea(
                user.getNgoProfile().getServiceArea()
        );

        dto.setLocation(
                user.getNgoProfile().getLocation()
        );
    }

    return dto;
}


    @Override
    @Transactional
    public ProfileResponseDto updateProfile(ProfileUpdateDto dto) {

        User user = getAuthenticatedUser();

        // Update the basic user info
        user.setName(dto.getName());
        
        // 🔹 ADD THIS: Check if they are an NGO and update their location
        if (user.getRole() == Role.NGO && user.getNgoProfile() != null) {
            if (dto.getLocation() != null) {
                user.getNgoProfile().setLocation(dto.getLocation());
            }
        }

        userRepository.save(user);

        return getMyProfile();
    }
    
    private User getAuthenticatedUser() {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
