package com.teamthree.legalaid.service;

import com.teamthree.legalaid.dto.CaseDTO;
import com.teamthree.legalaid.dto.CreateCaseRequest;
import com.teamthree.legalaid.entity.Case;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.repository.CaseRepository;
import com.teamthree.legalaid.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CaseService {

    private final CaseRepository caseRepository;
    private final UserRepository userRepository;

    @Transactional
    public CaseDTO createCase(User user, CreateCaseRequest request) {
        Case newCase = new Case();
        newCase.setUserId(user.getId());
        newCase.setCaseTitle(request.getCaseTitle());
        newCase.setTitle(request.getCaseTitle());
        newCase.setCaseDescription(request.getDescription());
        newCase.setDescription(request.getDescription());
        newCase.setCategory(request.getCategory());
        newCase.setLocation(request.getLocation());
        newCase.setStatus("SUBMITTED");
        newCase.setFiledDate(LocalDateTime.now());
        newCase.setClient(user);

        return mapToDTO(caseRepository.save(newCase));
    }

    public List<CaseDTO> getUserCases(User user) {
        return caseRepository.findByClientOrderByFiledDateDesc(user)
            .stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    public CaseDTO getCaseById(Long id) {
        Case case_ = caseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Case not found with id: " + id));
        return mapToDTO(case_);
    }

    private CaseDTO mapToDTO(Case case_) {
        CaseDTO dto = new CaseDTO();

        // Core fields
        dto.setId(case_.getId());
        dto.setCaseId(case_.getId());
        dto.setUserId(case_.getUserId() != null ? case_.getUserId()
            : (case_.getClient() != null ? case_.getClient().getId() : null));
        dto.setTitle(case_.getCaseTitle() != null ? case_.getCaseTitle() : case_.getTitle());
        dto.setCaseTitle(case_.getCaseTitle() != null ? case_.getCaseTitle() : case_.getTitle());
        dto.setDescription(case_.getCaseDescription() != null
            ? case_.getCaseDescription() : case_.getDescription());
        dto.setCategory(case_.getCategory());
        dto.setLocation(case_.getLocation());
        dto.setStatus(case_.getStatus());
        dto.setCreatedAt(case_.getCreatedAt());
        dto.setUpdatedAt(case_.getUpdatedAt());
        dto.setFilingDate(case_.getFiledDate());
        dto.setHearingDate(case_.getHearingDate());

        // People fields
        User client = case_.getClient() != null ? case_.getClient()
            : (case_.getUserId() != null ? userRepository.findById(case_.getUserId()).orElse(null) : null);
        if (client != null) {
            dto.setUserName(client.getFullname());
            dto.setUserEmail(client.getEmail());
            dto.setClientName(client.getFullname());
        }
        if (case_.getAssignedTo() != null) {
            dto.setLawyerName(case_.getAssignedTo().getFullname());
        }
        if (case_.getNgo() != null) {
            dto.setNgoName(case_.getNgo().getOrganizationName());
        }

        return dto;
    }
}