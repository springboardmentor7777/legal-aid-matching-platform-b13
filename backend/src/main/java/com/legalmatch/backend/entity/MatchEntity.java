package com.legalmatch.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Represents a match between a legal case and a service provider (Lawyer or NGO).
 * Tracks match score, acceptance status, and provider-specific case management data.
 */
@Entity
@Table(name = "matches", indexes = {
        @Index(name = "idx_case_id", columnList = "case_id"),
        @Index(name = "idx_provider_id", columnList = "provider_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    @JsonIgnore
    private Case legalCase;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citizen_id", nullable = false)
    @JsonIgnore
    private User citizen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    @JsonIgnore
    private User provider;

    @Column(name = "match_score")
    private double matchScore = 0.5;

    @Enumerated(EnumType.STRING)
    private MatchStatus status;

    @Column(name = "provider_notes", columnDefinition = "TEXT")
    private String providerNotes;

    @Column(name = "internal_status")
    private String internalStatus;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /**
     * Sets default values for status and internal tracking before initial persistence.
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = MatchStatus.PENDING;
        }
        if (this.internalStatus == null) {
            this.internalStatus = "Reviewing";
        }
    }
}