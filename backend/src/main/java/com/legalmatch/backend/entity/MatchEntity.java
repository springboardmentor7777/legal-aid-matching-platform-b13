package com.legalmatch.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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

    // 🔗 Case reference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    @JsonIgnore
    private Case legalCase;

    // 👤 Citizen (who created case)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citizen_id", nullable = false)
    @JsonIgnore
    private User citizen;

    // 👨‍⚖️ Provider (lawyer / NGO)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    @JsonIgnore
    private User provider;

    // ⭐ Matching score
    @Column(name = "match_score")
    private double matchScore = 0.5;

    // 📌 Status (PENDING / ACCEPTED / REJECTED)
    @Enumerated(EnumType.STRING)
    private MatchStatus status;

    // 📝 Provider notes (sticky notes for case management)
    @Column(name = "provider_notes", columnDefinition = "TEXT")
    private String providerNotes;

    // 🔄 Internal status tracking for providers
    @Column(name = "internal_status")
    private String internalStatus;

    // ⏱ Created time
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // 🔄 Auto set values before insert
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