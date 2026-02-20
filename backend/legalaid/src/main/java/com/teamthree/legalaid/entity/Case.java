package com.teamthree.legalaid.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "cases")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Case {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "case_title", nullable = false)
    private String caseTitle;

    @Column(name = "case_description", length = 1000)
    private String caseDescription;

    @Column(name = "status")
    private String status; // PENDING, ACTIVE, RESOLVED, COMPLETED, CLOSED

    @Column(name = "case_type")
    private String caseType;

    @Column(name = "filed_date")
    private LocalDateTime filedDate;

    @Column(name = "hearing_date")
    private LocalDateTime hearingDate;

    @Column(name = "court_name")
    private String courtName;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private User client;  // The user who filed the case

    @ManyToOne
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;  // The lawyer assigned to the case

    @ManyToOne
    @JoinColumn(name = "ngo_id")
    private NgoProfile ngo;  // The NGO handling the case

    @PrePersist
    protected void onCreate() {
        filedDate = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = "PENDING";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}