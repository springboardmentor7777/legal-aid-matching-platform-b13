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
@Table(name = "cases")
public class Case {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false)
    private String category;

    // --- New fields for the frontend form ---
    private String location;
    private String incidentDate;
    private String incidentTime;
    
    @Column(columnDefinition = "TEXT")
    private String additionalNotes;
    
    private String contactInfo;
    private String attachment;
    // ----------------------------------------

    @Enumerated(EnumType.STRING)
    private CaseStatus status;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
}