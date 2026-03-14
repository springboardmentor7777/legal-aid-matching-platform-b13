package com.milestone.backend.entity;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "impact_logs")
public class ImpactLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Connects to the Lawyer/NGO User (using User instead of Profile since profiles are split)
    @OneToOne
    @JoinColumn(name = "profile_id", nullable = false)
    private User provider;

    @Column(name = "cases_taken", nullable = false)
    private Integer casesTaken = 0;

    @Column(name = "cases_resolved", nullable = false)
    private Integer casesResolved = 0;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated = LocalDateTime.now();
}