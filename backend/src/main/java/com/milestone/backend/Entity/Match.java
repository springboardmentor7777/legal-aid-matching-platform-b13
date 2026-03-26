package com.milestone.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "matches" , uniqueConstraints = @UniqueConstraint(columnNames = {"case_id", "user_id"}))
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ID of the case being matched
    @Column(name = "case_id", nullable = false)
    private Long caseId;

    // ID of the matched user (lawyer or NGO)
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // Match score (optional, default 0)
    private double score = 0.0;

    // Status of the match (PENDING, ACCEPTED, REJECTED)
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MatchStatus status = MatchStatus.PENDING;

    // --- Relationships for easier access ---

    // Connect match to Case entity (read-only)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", insertable = false, updatable = false)
    private Case caseEntity;

    // Connect match to User entity (lawyer or NGO) (read-only)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User matchedUser;

    // Timestamp for when match was created
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Timestamp for last update
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
