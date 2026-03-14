package com.milestone.backend.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder // Added for easier testing and object creation
@Entity
@Table(name = "matches",
       indexes = {
           @Index(name = "idx_case_id", columnList = "case_id"),
           @Index(name = "idx_provider_id", columnList = "provider_id"),
           @Index(name = "idx_status", columnList = "status") // Index on status for faster filtering
       })
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // fetch = FetchType.LAZY is good for performance
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "case_id", nullable = false)
    private Case legalCase;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "provider_id", nullable = false)
    private User matchedProvider;
            
    @Column(nullable = false)
    private Integer score = 0; 

    @Column(nullable = false, updatable = false)
    private LocalDateTime matchDate;

    // Added to track when a provider accepts or rejects the match
    private LocalDateTime statusUpdatedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MatchStatus status = MatchStatus.PENDING;

    @PrePersist
    public void prePersist() {
        if (this.matchDate == null) {
            this.matchDate = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = MatchStatus.PENDING;
        }
    }

    // Custom setter for status to automatically update the timestamp
    public void setStatus(MatchStatus status) {
        this.status = status;
        this.statusUpdatedAt = LocalDateTime.now();
    }

    public enum MatchStatus {
        PENDING, ACCEPTED, REJECTED
    }
}