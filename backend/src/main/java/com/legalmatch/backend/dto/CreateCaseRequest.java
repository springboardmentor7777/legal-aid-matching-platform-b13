package com.legalmatch.backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateCaseRequest {

    // ── Core ──
    private String caseType;
    private String description;
    private String urgency;
    private String location;

    // ── Petitioner / Complainant ──
    private String petitionerName;
    private String petitionerContact;
    private String petitionerAddress;

    // ── Respondent / Accused ──
    private String respondentName;
    private String respondentContact;
    private String respondentAddress;

    // ── Jurisdiction & Court ──
    private String jurisdictionCity;
    private String jurisdictionState;
    private String courtName;

    // ── Financial Eligibility ──
    private Boolean financialEligibility;
    private BigDecimal annualIncome;

    // ── Evidence & Documentation ──
    private String firNumber;
    private LocalDate firDate;
    private String policeStation;
    private String evidenceSummary;
    private String documentsDescription;

    // ── Narrative ──
    private String chronologyOfEvents;
    private String reliefSought;
    private String previousLegalAction;

    // ── V25 Fields ──
    private LocalDate incidentDate;
    private Boolean hasPreviousLegalAction;
    private String previousLegalActionDetails;
    private String preferredLanguage;
    private String whatHappened;
    private String opposingPartyName;

    // ── V26 Fields ──
    private String desiredOutcome;
    private String whenDidItHappen;
    private Boolean hasUpcomingCourtDate;
    private LocalDate upcomingCourtDate;
    private Boolean caseFiledAgainstYou;
    private String firDocumentName;
}