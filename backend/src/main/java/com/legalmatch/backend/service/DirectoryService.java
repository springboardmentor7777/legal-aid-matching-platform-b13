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

<<<<<<< HEAD
        return profiles.map(p -> DirectoryProfileResponse.builder()
                .id(p.getId())
                .name(p.getUser().getUsername())
                .organizationName(p.getOrganizationName())
                .expertise(p.getExpertise())
                .location(p.getLocation())
                .verified(p.isVerified())
                .build());
=======
        return profiles.map(this::mapToResponse);
>>>>>>> c43b6ec660e4ac40d75ba60fd998006ba9f96575
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
                .name(p.getUser().getUsername())
                .organizationName(p.getOrganizationName())
                .expertise(p.getExpertise())
                .location(p.getLocation())
                .verified(p.isVerified())
                .build();
    }
}