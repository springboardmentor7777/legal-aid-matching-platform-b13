package com.legalmatch.backend.service;

import com.legalmatch.backend.dto.CaseResponse;
import com.legalmatch.backend.dto.CreateCaseRequest;
import com.legalmatch.backend.entity.Case;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.CaseRepository;
import com.legalmatch.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CaseService {

    private final CaseRepository caseRepository;
    private final UserRepository userRepository;

    public CaseResponse createCase(CreateCaseRequest request, String username) {

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getRole().name().equals("CITIZEN")) {
            throw new RuntimeException("Only citizens can create cases");
        }

        if (request.getCaseType() == null || request.getCaseType().isEmpty()) {
            throw new RuntimeException("Case type is required");
        }

        Case newCase = Case.builder()
                .user(user)
                // Core
                .caseType(request.getCaseType())
                .description(request.getDescription() != null ? request.getDescription() : "")
                .urgency(request.getUrgency() != null ? request.getUrgency() : "MEDIUM")
                .location(request.getLocation())
                // Petitioner
                .petitionerName(request.getPetitionerName())
                .petitionerContact(request.getPetitionerContact())
                .petitionerAddress(request.getPetitionerAddress())
                // Respondent
                .respondentName(request.getRespondentName())
                .respondentContact(request.getRespondentContact())
                .respondentAddress(request.getRespondentAddress())
                // Jurisdiction
                .jurisdictionCity(request.getJurisdictionCity())
                .jurisdictionState(request.getJurisdictionState())
                .courtName(request.getCourtName())
                // Financial
                .financialEligibility(request.getFinancialEligibility())
                .annualIncome(request.getAnnualIncome())
                // Evidence
                .firNumber(request.getFirNumber())
                .firDate(request.getFirDate())
                .policeStation(request.getPoliceStation())
                .evidenceSummary(request.getEvidenceSummary())
                .documentsDescription(request.getDocumentsDescription())
                // Narrative
                .chronologyOfEvents(request.getChronologyOfEvents())
                .reliefSought(request.getReliefSought())
                .previousLegalAction(request.getPreviousLegalAction())
                // V25 fields
                .incidentDate(request.getIncidentDate())
                .hasPreviousLegalAction(request.getHasPreviousLegalAction())
                .previousLegalActionDetails(request.getPreviousLegalActionDetails())
                .preferredLanguage(request.getPreferredLanguage())
                .whatHappened(request.getWhatHappened())
                .opposingPartyName(request.getOpposingPartyName())
                // V26 fields
                .desiredOutcome(request.getDesiredOutcome())
                .whenDidItHappen(request.getWhenDidItHappen())
                .hasUpcomingCourtDate(request.getHasUpcomingCourtDate())
                .upcomingCourtDate(request.getUpcomingCourtDate())
                .caseFiledAgainstYou(request.getCaseFiledAgainstYou())
                .firDocumentName(request.getFirDocumentName())
                .build();

        Case saved = caseRepository.save(newCase);

        return mapToResponse(saved);
    }

    public List<CaseResponse> getMyCases(String username) {

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return caseRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CaseResponse getCaseById(Long id) {
        Case c = caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found"));
        return mapToResponse(c);
    }

    public Case save(Case legalCase) {
        return caseRepository.save(legalCase);
    }

    public Case getCaseEntityById(Long id) {
        return caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found"));
    }

    public List<CaseResponse> getAllCases() {
        return caseRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private CaseResponse mapToResponse(Case c) {
        return CaseResponse.builder()
                .id(c.getId())
                // Core
                .caseType(c.getCaseType())
                .description(c.getDescription())
                .urgency(c.getUrgency())
                .location(c.getLocation())
                .status(c.getStatus() != null ? c.getStatus().name() : "SUBMITTED")
                // Petitioner
                .petitionerName(c.getPetitionerName())
                .petitionerContact(c.getPetitionerContact())
                .petitionerAddress(c.getPetitionerAddress())
                // Respondent
                .respondentName(c.getRespondentName())
                .respondentContact(c.getRespondentContact())
                .respondentAddress(c.getRespondentAddress())
                // Jurisdiction
                .jurisdictionCity(c.getJurisdictionCity())
                .jurisdictionState(c.getJurisdictionState())
                .courtName(c.getCourtName())
                // Financial
                .financialEligibility(c.getFinancialEligibility())
                .annualIncome(c.getAnnualIncome())
                // Evidence
                .firNumber(c.getFirNumber())
                .firDate(c.getFirDate())
                .policeStation(c.getPoliceStation())
                .evidenceSummary(c.getEvidenceSummary())
                .documentsDescription(c.getDocumentsDescription())
                // Narrative
                .chronologyOfEvents(c.getChronologyOfEvents())
                .reliefSought(c.getReliefSought())
                .previousLegalAction(c.getPreviousLegalAction())
                // V25 fields
                .incidentDate(c.getIncidentDate())
                .hasPreviousLegalAction(c.getHasPreviousLegalAction())
                .previousLegalActionDetails(c.getPreviousLegalActionDetails())
                .preferredLanguage(c.getPreferredLanguage())
                .whatHappened(c.getWhatHappened())
                .opposingPartyName(c.getOpposingPartyName())
                // V26 fields
                .desiredOutcome(c.getDesiredOutcome())
                .whenDidItHappen(c.getWhenDidItHappen())
                .hasUpcomingCourtDate(c.getHasUpcomingCourtDate())
                .upcomingCourtDate(c.getUpcomingCourtDate())
                .caseFiledAgainstYou(c.getCaseFiledAgainstYou())
                .firDocumentName(c.getFirDocumentName())
                // Timestamps
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}