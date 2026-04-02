package com.teamthree.legalaid.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "matches")   // ← THE FIX: tells Hibernate to use the "matches" table, not "match"
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "case_id", nullable = false)
    private Case caseEntity;

    @Column(name = "profile_id")
    private Long profileId;

    @Column(name = "profile_type")
    private String profileType;

    @Column(name = "match_score")
    private Integer matchScore;

    @Column(name = "status")
    private String status;

    @Column(name = "match_date")
    private LocalDateTime matchDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}