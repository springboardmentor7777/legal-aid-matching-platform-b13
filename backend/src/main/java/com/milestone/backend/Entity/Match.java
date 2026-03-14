package com.milestone.backend.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "matches",
       indexes = {
           @Index(name = "idx_case_id", columnList = "case_id"),
           @Index(name = "idx_provider_id", columnList = "provider_id")
       })
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Connects to the Case table
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    private Case legalCase;

    // Connects to the Lawyer or NGO's main User account
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    private User matchedProvider;

    // Automatically set match date when persisted
    @Column(nullable = false, updatable = false)
    private LocalDateTime matchDate;

    // Status enum for type safety
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MatchStatus status = MatchStatus.PENDING;

    // Automatically set matchDate before inserting
    @PrePersist
    public void prePersist() {
        matchDate = LocalDateTime.now();
    }

    // Enum for status
    public enum MatchStatus {
        PENDING,
        ACCEPTED,
        REJECTED
    }
}