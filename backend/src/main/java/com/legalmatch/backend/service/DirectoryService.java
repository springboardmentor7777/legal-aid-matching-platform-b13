package com.legalmatch.backend.service;

import com.legalmatch.backend.dto.DirectoryProfileResponse;
import com.legalmatch.backend.entity.LawyerProfile;
import com.legalmatch.backend.entity.NGOProfile;
import com.legalmatch.backend.repository.LawyerProfileRepository;
import com.legalmatch.backend.repository.NGOProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DirectoryService {

    private final LawyerProfileRepository lawyerRepo;
    private final NGOProfileRepository ngoRepo;

    public Page<DirectoryProfileResponse> getLawyers(
            String expertise,
            String location,
            boolean verified,
            int page,
            int size
    ) {
        String expertiseSearch = expertise != null ? expertise : "";
        String locationSearch = location != null ? location : "";
        PageRequest pageable = PageRequest.of(page, size);

        Page<LawyerProfile> profiles;
        if (verified) {
            profiles = lawyerRepo.findByExpertiseContainingIgnoreCaseAndLocationContainingIgnoreCaseAndVerifiedTrue(
                    expertiseSearch, locationSearch, pageable);
        } else {
            profiles = lawyerRepo.findByExpertiseContainingIgnoreCaseAndLocationContainingIgnoreCase(
                    expertiseSearch, locationSearch, pageable);
        }
        return profiles.map(this::mapLawyerToResponse);
    }

    public Page<DirectoryProfileResponse> getNgos(
            String expertise,
            String location,
            boolean verified,
            int page,
            int size
    ) {
        String focusSearch = expertise != null ? expertise : "";
        String locationSearch = location != null ? location : "";
        PageRequest pageable = PageRequest.of(page, size);

        Page<NGOProfile> profiles;
        if (verified) {
            profiles = ngoRepo.findByFocusAreaContainingIgnoreCaseAndLocationContainingIgnoreCaseAndVerifiedTrue(
                    focusSearch, locationSearch, pageable);
        } else {
            profiles = ngoRepo.findByFocusAreaContainingIgnoreCaseAndLocationContainingIgnoreCase(
                    focusSearch, locationSearch, pageable);
        }
        return profiles.map(this::mapNgoToResponse);
    }

    private DirectoryProfileResponse mapLawyerToResponse(LawyerProfile p) {
        return DirectoryProfileResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .organizationName(null)
                .expertise(p.getExpertise())
                .location(p.getLocation())
                .verified(p.getVerified() != null && p.getVerified())
                .build();
    }

    private DirectoryProfileResponse mapNgoToResponse(NGOProfile p) {
        return DirectoryProfileResponse.builder()
                .id(p.getId())
                .name(p.getUser().getUsername())
                .organizationName(p.getOrganizationName())
                .expertise(p.getFocusArea())
                .location(p.getLocation())
                .verified(p.getVerified() != null && p.getVerified())
                .build();
    }
}