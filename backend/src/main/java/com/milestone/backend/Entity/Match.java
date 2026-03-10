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
@Table(name = "matches")
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Connects to the Case table
    @ManyToOne
    @JoinColumn(name = "case_id", nullable = false)
    private Case legalCase; 

    // Connects to the Lawyer or NGO's main User account instead of a missing Profile class
    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    private User matchedProvider; 

    private LocalDateTime matchDate = LocalDateTime.now();

    // Status can be PENDING, ACCEPTED, or REJECTED
    @Column(nullable = false)
    private String status = "PENDING"; 
}