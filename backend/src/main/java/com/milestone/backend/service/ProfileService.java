package com.milestone.backend.service;

import com.milestone.backend.dto.ProfileResponseDto;
import com.milestone.backend.dto.ProfileUpdateDto;
import java.util.Map;
import java.util.List;

public interface ProfileService {

    List<ProfileResponseDto> getAllProfiles();

    ProfileResponseDto getMyProfile();

    ProfileResponseDto updateProfile(ProfileUpdateDto dto);

    Map<String, Object> updateUserVerification(String email, boolean isVerified);
}