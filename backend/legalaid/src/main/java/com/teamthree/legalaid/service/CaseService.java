package com.teamthree.legalaid.service;

import com.teamthree.legalaid.dto.CaseDTO;
import com.teamthree.legalaid.dto.CreateCaseRequest;
import com.teamthree.legalaid.entity.Case;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.repository.CaseRepository;
import com.teamthree.legalaid.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public CaseDTO createCase(User user, CreateCaseRequest request) {
        Case newCase = new Case();
        newCase.setUserId(user.getId());
        newCase.setClient(user);

        // Core fields
        newCase.setCaseTitle(request.getCaseTitle());
        newCase.setTitle(request.getCaseTitle());
        newCase.setCaseDescription(request.getDescription());
        newCase.setDescription(request.getDescription());
        newCase.setCategory(request.getCategory());
        newCase.setLocation(request.getLocation());
        newCase.setStatus("SUBMITTED");
        newCase.setFiledDate(LocalDateTime.now());

        // Extended fields
        newCase.setKeywords(request.getKeywords());
        newCase.setContactInfo(request.getContactInfo());

        // Parse dateTime string to LocalDateTime
        if (request.getDateTime() != null && !request.getDateTime().isEmpty()) {
            try {
                newCase.setDateTime(LocalDateTime.parse(request.getDateTime().replace("T", "T")));
            } catch (Exception e) {
                // ignore parse error
            }
        }

        // Other Party
        newCase.setOtherPartyName(request.getOtherPartyName());
        newCase.setOtherPartyLocation(request.getOtherPartyLocation());
        newCase.setOtherPartyContact(request.getOtherPartyContact());
        newCase.setOtherPartyRepresentative(request.getOtherPartyRepresentative());

        // Criminal
        newCase.setInvestigatingOfficer(request.getInvestigatingOfficer());
        newCase.setWitnesses(request.getWitnesses());

        // Status
        newCase.setCurrentStatus(request.getCurrentStatus());

        // Evidence
        newCase.setFirNumber(request.getFirNumber());
        newCase.setFirDocument(request.getFirDocument());
        newCase.setFirDocumentName(request.getFirDocumentName());

        // Store document lists as JSON strings
        try {
            if (request.getCaseDocuments() != null) {
                newCase.setCaseDocuments(objectMapper.writeValueAsString(request.getCaseDocuments()));
            }
            if (request.getCaseDocumentNames() != null) {
                newCase.setCaseDocumentNames(objectMapper.writeValueAsString(request.getCaseDocumentNames()));
            }
        } catch (Exception e) {
            // ignore
        }

        Case savedCase = caseRepository.save(newCase);
        return mapToDTO(savedCase, user);
    }

    public List<CaseDTO> getUserCases(User user) {
        return caseRepository.findByClientOrderByFiledDateDesc(user)
                .stream()
                .map(c -> mapToDTO(c, user))
                .collect(Collectors.toList());
    }

    public CaseDTO getCaseById(Long id) {
        Case case_ = caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found with id: " + id));

        User user = null;
        if (case_.getClient() != null) {
            user = case_.getClient();
        } else if (case_.getUserId() != null) {
            user = userRepository.findById(case_.getUserId()).orElse(null);
        }

        return mapToDTO(case_, user);
    }

    public List<CaseDTO> filterCases(Long userId, String status, String category) {
        List<Case> cases = caseRepository.findAll();
        return cases.stream()
                .filter(c -> userId == null || (c.getUserId() != null && c.getUserId().equals(userId)))
                .filter(c -> status == null || status.equals(c.getStatus()))
                .filter(c -> category == null || category.equals(c.getCategory()))
                .map(c -> {
                    User user = c.getClient() != null ? c.getClient() :
                               (c.getUserId() != null ? userRepository.findById(c.getUserId()).orElse(null) : null);
                    return mapToDTO(c, user);
                })
                .collect(Collectors.toList());
    }

    public boolean isCaseOwner(User user, Long caseId) {
        return caseRepository.findById(caseId)
                .map(c -> c.getClient() != null ? c.getClient().getId().equals(user.getId()) :
                         (c.getUserId() != null && c.getUserId().equals(user.getId())))
                .orElse(false);
    }

    private CaseDTO mapToDTO(Case case_, User user) {
        CaseDTO dto = new CaseDTO();
        dto.setId(case_.getId());
        dto.setCaseId(case_.getId());
        dto.setUserId(case_.getUserId() != null ? case_.getUserId() :
                      (case_.getClient() != null ? case_.getClient().getId() : null));

        // Title
        dto.setTitle(case_.getCaseTitle() != null ? case_.getCaseTitle() : case_.getTitle());
        dto.setCaseTitle(case_.getCaseTitle() != null ? case_.getCaseTitle() : case_.getTitle());

        // Description
        dto.setDescription(case_.getCaseDescription() != null ? case_.getCaseDescription() : case_.getDescription());

        // Core
        dto.setCategory(case_.getCategory());
        dto.setLocation(case_.getLocation());
        dto.setStatus(case_.getStatus());
        dto.setCreatedAt(case_.getCreatedAt());
        dto.setUpdatedAt(case_.getUpdatedAt());
        dto.setFilingDate(case_.getFiledDate());
        dto.setHearingDate(case_.getHearingDate());

        // Extended
        dto.setKeywords(case_.getKeywords());
        dto.setContactInfo(case_.getContactInfo());
        if (case_.getDateTime() != null) {
            dto.setDateTime(case_.getDateTime().toString());
        }

        // Other Party
        dto.setOtherPartyName(case_.getOtherPartyName());
        dto.setOtherPartyLocation(case_.getOtherPartyLocation());
        dto.setOtherPartyContact(case_.getOtherPartyContact());
        dto.setOtherPartyRepresentative(case_.getOtherPartyRepresentative());

        // Criminal
        dto.setInvestigatingOfficer(case_.getInvestigatingOfficer());
        dto.setWitnesses(case_.getWitnesses());

        // Status
        dto.setCurrentStatus(case_.getCurrentStatus());

        // Evidence
        dto.setFirNumber(case_.getFirNumber());
        dto.setFirDocument(case_.getFirDocument());
        dto.setFirDocumentName(case_.getFirDocumentName());

        // Parse JSON document lists
        try {
            if (case_.getCaseDocuments() != null) {
                dto.setCaseDocuments(objectMapper.readValue(case_.getCaseDocuments(), new TypeReference<List<String>>() {}));
            }
            if (case_.getCaseDocumentNames() != null) {
                dto.setCaseDocumentNames(objectMapper.readValue(case_.getCaseDocumentNames(), new TypeReference<List<String>>() {}));
            }
        } catch (Exception e) {
            // ignore
        }

        // User info
        if (user != null) {
            dto.setUserName(user.getFullname());
            dto.setUserEmail(user.getEmail());
            dto.setClientName(user.getFullname());
        } else if (case_.getClient() != null) {
            dto.setUserName(case_.getClient().getFullname());
            dto.setUserEmail(case_.getClient().getEmail());
            dto.setClientName(case_.getClient().getFullname());
        }

        // Assigned lawyer/NGO
        if (case_.getAssignedTo() != null) {
            dto.setLawyerName(case_.getAssignedTo().getFullname());
        }
        if (case_.getNgo() != null) {
            dto.setNgoName(case_.getNgo().getOrganizationName());
        }

        return dto;
    }
}