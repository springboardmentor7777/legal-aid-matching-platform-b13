package com.legalmatch.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Case {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ── Core Fields ──
    @Column(nullable = false)
    private String caseType;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false)
    private String urgency;

    private String location;

    @Enumerated(EnumType.STRING)
    private CaseStatus status;

    // ── Petitioner / Complainant ──
    private String petitionerName;
    private String petitionerContact;

    @Column(columnDefinition = "TEXT")
    private String petitionerAddress;

    // ── Respondent / Accused ──
    private String respondentName;
    private String respondentContact;

    @Column(columnDefinition = "TEXT")
    private String respondentAddress;

    // ── Jurisdiction & Court ──
    private String jurisdictionCity;
    private String jurisdictionState;
    private String courtName;

    // ── Financial Eligibility (Pro Bono) ──
    @Column(name = "financial_eligibility")
    private Boolean financialEligibility;

    @Column(name = "annual_income", precision = 12, scale = 2)
    private BigDecimal annualIncome;

    // ── Evidence & Documentation ──
    private String firNumber;
    private LocalDate firDate;
    private String policeStation;

    @Column(columnDefinition = "TEXT")
    private String evidenceSummary;

    @Column(columnDefinition = "TEXT")
    private String documentsDescription;

    // ── Narrative ──
    @Column(columnDefinition = "TEXT")
    private String chronologyOfEvents;

    @Column(columnDefinition = "TEXT")
    private String reliefSought;

    @Column(columnDefinition = "TEXT")
    private String previousLegalAction;

    // ── V25 Fields ──
    @Column(name = "incident_date")
    private LocalDate incidentDate;

    @Column(name = "has_previous_legal_action")
    private Boolean hasPreviousLegalAction;

    @Column(name = "previous_legal_action_details", columnDefinition = "TEXT")
    private String previousLegalActionDetails;

    @Column(name = "preferred_language")
    private String preferredLanguage;

    @Column(name = "what_happened", columnDefinition = "TEXT")
    private String whatHappened;

    @Column(name = "opposing_party_name")
    private String opposingPartyName;

    // ── V26 Fields ──
    @Column(name = "desired_outcome", columnDefinition = "TEXT")
    private String desiredOutcome;

    @Column(name = "when_did_it_happen")
    private String whenDidItHappen;

    @Column(name = "has_upcoming_court_date")
    private Boolean hasUpcomingCourtDate;

    @Column(name = "upcoming_court_date")
    private LocalDate upcomingCourtDate;

    @Column(name = "case_filed_against_you")
    private Boolean caseFiledAgainstYou;

    @Column(name = "fir_document_name")
    private String firDocumentName;

    // ── Timestamps ──
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = CaseStatus.SUBMITTED;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}