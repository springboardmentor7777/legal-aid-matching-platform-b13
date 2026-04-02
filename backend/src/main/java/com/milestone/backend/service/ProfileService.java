package com.milestone.backend.service;

import com.milestone.backend.dto.ProfileResponseDto;
import com.milestone.backend.dto.ProfileUpdateDto;
import com.milestone.backend.dto.VerificationDto;

import java.util.Map;
import java.util.List;

public interface ProfileService {

    List<ProfileResponseDto> getAllProfiles();

    ProfileResponseDto getMyProfile();

    ProfileResponseDto updateProfile(ProfileUpdateDto dto);

    Map<String, Object> updateUserVerification(String email, boolean isVerified);

    List<VerificationDto> getPendingProfiles();

    Map<String, Object> updateVerificationStatus(Long id, Boolean status);
}