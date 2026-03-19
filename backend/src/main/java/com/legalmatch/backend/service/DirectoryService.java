package com.legalmatch.backend.service;

import com.legalmatch.backend.dto.DirectoryProfileResponse;
import com.legalmatch.backend.entity.DirectoryProfile;
import com.legalmatch.backend.entity.Role;
import com.legalmatch.backend.repository.DirectoryProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DirectoryService {

    private final DirectoryProfileRepository repository;

    public Page<DirectoryProfileResponse> getLawyers(
            String expertise,
            String location,
            boolean verified,
            int page,
            int size
    ) {
        Page<DirectoryProfile> profiles =
                repository.findByUser_RoleAndExpertiseContainingIgnoreCaseAndLocationContainingIgnoreCaseAndVerified(
                        Role.LAWYER,
                        expertise,
                        location,
                        verified,
                        PageRequest.of(page, size)
                );

        return profiles.map(this::mapToResponse);
    }

    public Page<DirectoryProfileResponse> getNgos(
            String expertise,
            String location,
            boolean verified,
            int page,
            int size
    ) {
        Page<DirectoryProfile> profiles =
                repository.findByUser_RoleAndExpertiseContainingIgnoreCaseAndLocationContainingIgnoreCaseAndVerified(
                        Role.NGO,
                        expertise,
                        location,
                        verified,
                        PageRequest.of(page, size)
                );

        return profiles.map(this::mapToResponse);
    }

    public List<DirectoryProfile> findByRole(Role role) {
        return repository.findByUser_Role(role);
    }

    public List<DirectoryProfile> findAll() {
        return repository.findAll();
    }

    private DirectoryProfileResponse mapToResponse(DirectoryProfile p) {
        return DirectoryProfileResponse.builder()
                .id(p.getId())
                .name(p.getUser().getName())
                .organizationName(p.getOrganizationName())
                .expertise(p.getExpertise())
                .location(p.getLocation())
                .verified(p.isVerified())
                .build();
    }
}