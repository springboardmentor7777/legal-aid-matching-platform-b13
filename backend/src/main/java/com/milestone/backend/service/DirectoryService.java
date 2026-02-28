package com.milestone.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.milestone.backend.dto.LawyerDto;
import com.milestone.backend.dto.NgoDto;
import com.milestone.backend.entity.Role;
import com.milestone.backend.entity.User;
import com.milestone.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DirectoryService {

    private final UserRepository userRepository;

    public List<LawyerDto> getAllLawyers() {
        List<User> lawyers = userRepository.findAllByRole(Role.LAWYER);

        return lawyers.stream().map(user -> {
            LawyerDto.LawyerDtoBuilder builder = LawyerDto.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .isVerified(user.getIsVerified());

            if (user.getLawyerProfile() != null) {
                builder.specialization(user.getLawyerProfile().getSpecialization());
                builder.experience(user.getLawyerProfile().getExperience()); // <-- Mapped experience
                builder.location(user.getLawyerProfile().getLocation());
            }

            return builder.build();
        }).collect(Collectors.toList());
    }

    public Page<LawyerDto> searchLawyers(String location, String expertise, Boolean isVerified, Pageable pageable) {
        // Fetch the paginated and filtered results from the database
        Page<User> lawyerPage = userRepository.searchLawyers(Role.LAWYER, location, expertise, isVerified, pageable);
        
        // Map the User entities to LawyerDtos (Spring Page automatically handles the list conversion!)
        return lawyerPage.map(user -> {
            LawyerDto.LawyerDtoBuilder builder = LawyerDto.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .isVerified(user.getIsVerified());

            if (user.getLawyerProfile() != null) {
                builder.specialization(user.getLawyerProfile().getSpecialization());
                builder.experience(user.getLawyerProfile().getExperience());
                builder.location(user.getLawyerProfile().getLocation());
            }
            return builder.build();
        });
    }

    public Page<NgoDto> searchNgos(String location, Boolean isVerified, Pageable pageable) {
        // Fetch the paginated and filtered NGOs
        Page<User> ngoPage = userRepository.searchNgos(Role.NGO, location, isVerified, pageable);
        
        // Map them to the DTO
        return ngoPage.map(user -> {
            NgoDto.NgoDtoBuilder builder = NgoDto.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .isVerified(user.getIsVerified());

            if (user.getNgoProfile() != null) {
                builder.organizationName(user.getNgoProfile().getOrganizationName());
                builder.serviceArea(user.getNgoProfile().getServiceArea()); // Maps to the location search
            }
            return builder.build();
        });
    }

    public List<NgoDto> getAllNgos() {
        // 1. Fetch all users with the NGO role
        List<User> ngos = userRepository.findAllByRole(Role.NGO);

        // 2. Map them to the DTO
        return ngos.stream().map(user -> {
            NgoDto.NgoDtoBuilder builder = NgoDto.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .isVerified(user.getIsVerified());

            // Safely map the NGO profile fields if it exists
            if (user.getNgoProfile() != null) {
                builder.organizationName(user.getNgoProfile().getOrganizationName());
                builder.serviceArea(user.getNgoProfile().getServiceArea());
            }

            return builder.build();
        }).collect(Collectors.toList());
    }
}