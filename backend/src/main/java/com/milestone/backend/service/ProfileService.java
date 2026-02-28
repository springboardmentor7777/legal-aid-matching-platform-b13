package com.milestone.backend.service;

import com.milestone.backend.dto.ProfileResponseDto;
import com.milestone.backend.dto.ProfileUpdateDto;

public interface ProfileService {

    ProfileResponseDto getMyProfile();

    ProfileResponseDto updateProfile(ProfileUpdateDto dto);
}
