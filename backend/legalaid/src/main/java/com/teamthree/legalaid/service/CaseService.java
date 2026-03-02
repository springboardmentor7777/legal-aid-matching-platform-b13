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
        
        // Set both title fields with the same value
        newCase.setCaseTitle(request.getCaseTitle());  // For case_title column
        newCase.setTitle(request.getCaseTitle());      // For title column
        
        newCase.setDescription(request.getDescription());
        newCase.setCategory(request.getCategory());
        newCase.setStatus("SUBMITTED");
        
        Case savedCase = caseRepository.save(newCase);
        return mapToDTO(savedCase, user);
    }

    public List<CaseDTO> getUserCases(User user) {
        return caseRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(c -> mapToDTO(c, user))
                .collect(Collectors.toList());
    }

    public CaseDTO getCaseById(Long id) {
        Case case_ = caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found with id: " + id));
        
        User user = userRepository.findById(case_.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return mapToDTO(case_, user);
    }

    public List<CaseDTO> filterCases(Long userId, String status, String category) {
        return caseRepository.filterCases(userId, status, category)
                .stream()
                .map(c -> {
                    User user = userRepository.findById(c.getUserId()).orElse(null);
                    return mapToDTO(c, user);
                })
                .collect(Collectors.toList());
    }

    public boolean isCaseOwner(User user, Long caseId) {
        return caseRepository.existsByIdAndUserId(caseId, user.getId());
    }

    private CaseDTO mapToDTO(Case case_, User user) {
        CaseDTO dto = new CaseDTO();
        dto.setId(case_.getId());
        dto.setUserId(case_.getUserId());
        
        // Use caseTitle for the DTO title field
        dto.setTitle(case_.getCaseTitle());  // Changed from getTitle() to getCaseTitle()
        
        dto.setDescription(case_.getDescription());
        dto.setCategory(case_.getCategory());
        dto.setStatus(case_.getStatus());
        dto.setCreatedAt(case_.getCreatedAt());
        dto.setUpdatedAt(case_.getUpdatedAt());
        
        if (user != null) {
            dto.setUserName(user.getFullname());
            dto.setUserEmail(user.getEmail());
        }
        
        return dto;
    }
}