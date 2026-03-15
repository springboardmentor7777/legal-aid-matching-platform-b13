package com.milestone.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "matches")
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long caseId;

    private Long userId;

    private double score = 0.0;

    @Enumerated(EnumType.STRING)
    private MatchStatus status = MatchStatus.PENDING; // default to PENDING
}