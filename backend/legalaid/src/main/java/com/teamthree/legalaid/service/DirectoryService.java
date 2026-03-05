package com.teamthree.legalaid.service;

import com.teamthree.legalaid.dto.LawyerDirectoryDTO;
import com.teamthree.legalaid.dto.NgoDirectoryDTO;
import com.teamthree.legalaid.dto.PagedResponse;
import com.teamthree.legalaid.entity.LawyerProfile;
import com.teamthree.legalaid.entity.NgoProfile;
import com.teamthree.legalaid.repository.LawyerRepository;
import com.teamthree.legalaid.repository.NgoProfileRepository;
import com.teamthree.legalaid.specification.DirectorySpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DirectoryService {

    private final LawyerRepository lawyerRepository;
    private final NgoProfileRepository ngoProfileRepository;

    // --- Lawyer Directory ---

    public PagedResponse<LawyerDirectoryDTO> getLawyers(
            String keyword, String expertise, String location, Boolean verified,
            int page, int size, String sortBy, String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<LawyerProfile> result = lawyerRepository.findAll(
                DirectorySpecification.lawyerSpec(keyword, expertise, location, verified),
                pageable
        );

        List<LawyerDirectoryDTO> content = result.getContent()
                .stream()
                .map(this::toLawyerDTO)
                .collect(Collectors.toList());

        return PagedResponse.<LawyerDirectoryDTO>builder()
                .content(content)
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .last(result.isLast())
                .build();
    }

    // --- NGO Directory ---

    public PagedResponse<NgoDirectoryDTO> getNgos(
            String keyword, String expertise, String location, Boolean verified,
            int page, int size, String sortBy, String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<NgoProfile> result = ngoProfileRepository.findAll(
                DirectorySpecification.ngoSpec(keyword, expertise, location, verified),
                pageable
        );

        List<NgoDirectoryDTO> content = result.getContent()
                .stream()
                .map(this::toNgoDTO)
                .collect(Collectors.toList());

        return PagedResponse.<NgoDirectoryDTO>builder()
                .content(content)
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .last(result.isLast())
                .build();
    }

    // --- Mappers ---

    private LawyerDirectoryDTO toLawyerDTO(LawyerProfile l) {
        return LawyerDirectoryDTO.builder()
                .id(l.getId())
                .name(l.getUser() != null ? l.getUser().getFullname() : null)
                .email(l.getUser() != null ? l.getUser().getEmail() : null)
                .specialization(l.getSpecialization())
                .expertise(l.getExpertise())
                .location(l.getLocation())
                .verified(l.getVerified())
                .contactInfo(l.getContactInfo())
                .experienceYears(l.getExperienceYears())
                .isAvailable(l.getIsAvailable())
                .build();
    }

    private NgoDirectoryDTO toNgoDTO(NgoProfile n) {
        return NgoDirectoryDTO.builder()
                .id(n.getId())
                .name(n.getUser() != null ? n.getUser().getFullname() : null)
                .email(n.getUser() != null ? n.getUser().getEmail() : null)
                .organizationName(n.getOrganizationName())
                .registrationNumber(n.getRegistrationNumber())
                .expertise(n.getExpertise())
                .location(n.getLocation())
                .verified(n.getVerified())
                .contactInfo(n.getContactInfo())
                .isActive(n.getIsActive())
                .build();
    }
}