package com.legalmatch.backend.service;

import com.legalmatch.backend.dto.OnboardingRequest;
import com.legalmatch.backend.entity.*;
import com.legalmatch.backend.repository.LawyerProfileRepository;
import com.legalmatch.backend.repository.NGOProfileRepository;
import com.legalmatch.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OnboardingService {

    private final UserRepository userRepository;
    private final LawyerProfileRepository lawyerProfileRepository;
    private final NGOProfileRepository ngoProfileRepository;

    @Transactional
    public void completeOnboarding(OnboardingRequest request, String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == Role.LAWYER) {
            completeLawyerOnboarding(request, user);
        } else if (user.getRole() == Role.NGO) {
            completeNGOOnboarding(request, user);
        } else {
            throw new RuntimeException("Onboarding is only for LAWYER and NGO roles");
        }

        user.setOnboardingComplete(true);
        userRepository.save(user);
    }

    private void completeLawyerOnboarding(OnboardingRequest request, User user) {
        LawyerProfile profile = lawyerProfileRepository.findByUser(user)
                .orElse(LawyerProfile.builder().user(user).build());

        profile.setState(request.getState());
        profile.setCity(request.getCity());
        profile.setPracticeAreas(request.getPracticeAreas());
        profile.setOfficeAddress(request.getOfficeAddress());
        profile.setBarCouncilLicense(request.getBarCouncilLicense());
        profile.setLicenseDocumentName(request.getLicenseDocumentName());

        // Set location from state + city for match scoring
        if (request.getCity() != null && request.getState() != null) {
            profile.setLocation(request.getCity() + ", " + request.getState());
        }

        // Set expertise from practice areas for match scoring
        if (request.getPracticeAreas() != null) {
            profile.setExpertise(request.getPracticeAreas());
        }

        if (profile.getName() == null || profile.getName().isEmpty()) {
            profile.setName(user.getUsername());
        }

        lawyerProfileRepository.save(profile);
    }

    private void completeNGOOnboarding(OnboardingRequest request, User user) {
        NGOProfile profile = ngoProfileRepository.findByUser(user)
                .orElse(NGOProfile.builder().user(user).build());

        profile.setState(request.getState());
        profile.setCity(request.getCity());
        profile.setFocusAreas(request.getFocusAreas());
        profile.setOfficeAddress(request.getOfficeAddress());
        profile.setNgoDarpanId(request.getNgoDarpanId());
        profile.setRegistrationCertName(request.getRegistrationCertName());

        // Set location from state + city for match scoring
        if (request.getCity() != null && request.getState() != null) {
            profile.setLocation(request.getCity() + ", " + request.getState());
        }

        // Set focus area from focus areas for match scoring
        if (request.getFocusAreas() != null) {
            profile.setFocusArea(request.getFocusAreas());
        }

        if (profile.getOrganizationName() == null || profile.getOrganizationName().isEmpty()) {
            profile.setOrganizationName(user.getUsername());
        }

        ngoProfileRepository.save(profile);
    }
}
