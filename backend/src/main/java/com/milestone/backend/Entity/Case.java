package com.milestone.backend.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "cases", indexes = {
        @Index(name = "idx_case_category", columnList = "category"),
        @Index(name = "idx_case_location", columnList = "location")
})
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

    private String location;
    private String incidentDate;
    private String incidentTime;

    @Column(columnDefinition = "TEXT")
    private String additionalNotes;

    private String contactInfo;
    private String attachment;

    // --- NEW FIELDS FOR 3-LEVEL FORM ---
    private String personName;
    private String customCategory;
    private String subcategory;
    private String currentStatus;
    private String firNumber;
    private String firFile;
    private String otherLocation;
    private String otherRepresentative;
    
    @Column(columnDefinition = "TEXT")
    private String legalDocuments;
    // -----------------------------------

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CaseStatus status = CaseStatus.SUBMITTED;  

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}