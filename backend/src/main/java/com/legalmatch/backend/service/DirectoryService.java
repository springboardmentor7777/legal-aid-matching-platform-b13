package com.legalmatch.backend.service;

import com.legalmatch.backend.dto.DirectoryProfileResponse;
import com.legalmatch.backend.entity.DirectoryProfile;
import com.legalmatch.backend.entity.Role;
import com.legalmatch.backend.repository.DirectoryProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DirectoryService {

    private final DirectoryProfileRepository repository;

    public Page<DirectoryProfileResponse> getLawyers(int page, int size) {

        Page<DirectoryProfile> profiles =
                repository.findByUserRoleAndVerifiedTrue(
                        Role.LAWYER,
                        PageRequest.of(page, size)
                );

        return profiles.map(p -> DirectoryProfileResponse.builder()
                .id(p.getId())
                .name(p.getUser().getName())
                .organizationName(p.getOrganizationName())
                .expertise(p.getExpertise())
                .location(p.getLocation())
                .verified(p.isVerified())
                .build());
    }

}