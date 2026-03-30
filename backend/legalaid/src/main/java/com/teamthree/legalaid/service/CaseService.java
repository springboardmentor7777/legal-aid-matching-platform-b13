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
        newCase.setCaseTitle(request.getCaseTitle());
        newCase.setTitle(request.getCaseTitle());
        newCase.setCaseDescription(request.getDescription());
        newCase.setDescription(request.getDescription());
        newCase.setCategory(request.getCategory());
        newCase.setLocation(request.getLocation());

        // NEW: case starts as OPEN — user sends requests directly to lawyers/NGOs
        newCase.setStatus("OPEN");
        newCase.setFiledDate(LocalDateTime.now());

        newCase.setKeywords(request.getKeywords());
        newCase.setContactInfo(request.getContactInfo());
        if (request.getDateTime() != null && !request.getDateTime().isEmpty()) {
            try { newCase.setDateTime(LocalDateTime.parse(request.getDateTime())); } catch (Exception ignored) {}
        }
        newCase.setOtherPartyName(request.getOtherPartyName());
        newCase.setOtherPartyLocation(request.getOtherPartyLocation());
        newCase.setOtherPartyContact(request.getOtherPartyContact());
        newCase.setOtherPartyRepresentative(request.getOtherPartyRepresentative());
        newCase.setInvestigatingOfficer(request.getInvestigatingOfficer());
        newCase.setWitnesses(request.getWitnesses());
        newCase.setCurrentStatus(request.getCurrentStatus());
        newCase.setFirNumber(request.getFirNumber());
        newCase.setFirDocument(request.getFirDocument());
        newCase.setFirDocumentName(request.getFirDocumentName());
        try {
            if (request.getCaseDocuments() != null)
                newCase.setCaseDocuments(objectMapper.writeValueAsString(request.getCaseDocuments()));
            if (request.getCaseDocumentNames() != null)
                newCase.setCaseDocumentNames(objectMapper.writeValueAsString(request.getCaseDocumentNames()));
        } catch (Exception ignored) {}

        return mapToDTO(caseRepository.save(newCase), user);
    }

    public List<CaseDTO> getUserCases(User user) {
        return caseRepository.findByClientOrderByFiledDateDesc(user)
                .stream().map(c -> mapToDTO(c, user)).collect(Collectors.toList());
    }

    public CaseDTO getCaseById(Long id) {
        Case c = caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found: " + id));
        User user = c.getClient() != null ? c.getClient()
                  : (c.getUserId() != null ? userRepository.findById(c.getUserId()).orElse(null) : null);
        return mapToDTO(c, user);
    }

    public List<CaseDTO> getAllCases() {
        return caseRepository.findAll().stream().map(c -> {
            User user = c.getClient() != null ? c.getClient()
                      : (c.getUserId() != null ? userRepository.findById(c.getUserId()).orElse(null) : null);
            return mapToDTO(c, user);
        }).collect(Collectors.toList());
    }

    public boolean isCaseOwner(User user, Long caseId) {
        return caseRepository.findById(caseId)
                .map(c -> c.getClient() != null ? c.getClient().getId().equals(user.getId())
                        : (c.getUserId() != null && c.getUserId().equals(user.getId())))
                .orElse(false);
    }

    public CaseDTO mapToDTO(Case c, User user) {
        CaseDTO dto = new CaseDTO();
        dto.setId(c.getId());
        dto.setCaseId(c.getId());
        dto.setUserId(c.getUserId() != null ? c.getUserId() : (c.getClient() != null ? c.getClient().getId() : null));
        dto.setTitle(c.getCaseTitle() != null ? c.getCaseTitle() : c.getTitle());
        dto.setCaseTitle(c.getCaseTitle() != null ? c.getCaseTitle() : c.getTitle());
        dto.setDescription(c.getCaseDescription() != null ? c.getCaseDescription() : c.getDescription());
        dto.setCategory(c.getCategory());
        dto.setLocation(c.getLocation());
        dto.setStatus(c.getStatus());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());
        dto.setFilingDate(c.getFiledDate());
        dto.setHearingDate(c.getHearingDate());
        dto.setKeywords(c.getKeywords());
        dto.setContactInfo(c.getContactInfo());
        if (c.getDateTime() != null) dto.setDateTime(c.getDateTime().toString());
        dto.setOtherPartyName(c.getOtherPartyName());
        dto.setOtherPartyLocation(c.getOtherPartyLocation());
        dto.setOtherPartyContact(c.getOtherPartyContact());
        dto.setOtherPartyRepresentative(c.getOtherPartyRepresentative());
        dto.setInvestigatingOfficer(c.getInvestigatingOfficer());
        dto.setWitnesses(c.getWitnesses());
        dto.setCurrentStatus(c.getCurrentStatus());
        dto.setFirNumber(c.getFirNumber());
        dto.setFirDocument(c.getFirDocument());
        dto.setFirDocumentName(c.getFirDocumentName());
        try {
            if (c.getCaseDocuments() != null)
                dto.setCaseDocuments(objectMapper.readValue(c.getCaseDocuments(), new TypeReference<List<String>>() {}));
            if (c.getCaseDocumentNames() != null)
                dto.setCaseDocumentNames(objectMapper.readValue(c.getCaseDocumentNames(), new TypeReference<List<String>>() {}));
        } catch (Exception ignored) {}
        User owner = user != null ? user : c.getClient();
        if (owner != null) {
            dto.setUserName(owner.getFullname());
            dto.setUserEmail(owner.getEmail());
            dto.setClientName(owner.getFullname());
        }
        if (c.getAssignedTo() != null) dto.setLawyerName(c.getAssignedTo().getFullname());
        if (c.getNgo() != null) dto.setNgoName(c.getNgo().getOrganizationName());
        return dto;
    }
}