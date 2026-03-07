package com.teamthree.legalaid.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cases")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Case {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "case_title")
    private String caseTitle;

    @Column(name = "title")
    private String title;

    @Column(name = "case_description")
    private String caseDescription;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "category")
    private String category;

    @Column(name = "location")
    private String location;

    @Column(name = "keywords")
    private String keywords;

    @Column(name = "date_time")
    private LocalDateTime dateTime;

    @Column(name = "contact_info")
    private String contactInfo;

    // Other Party
    @Column(name = "other_party_name")
    private String otherPartyName;

    @Column(name = "other_party_location")
    private String otherPartyLocation;

    @Column(name = "other_party_contact")
    private String otherPartyContact;

    @Column(name = "other_party_representative")
    private String otherPartyRepresentative;

    // Criminal
    @Column(name = "investigating_officer")
    private String investigatingOfficer;

    @Column(name = "witnesses", columnDefinition = "TEXT")
    private String witnesses;

    // Status
    private String status;

    @Column(name = "current_status")
    private String currentStatus;

    // Evidence
    @Column(name = "fir_number")
    private String firNumber;

    @Column(name = "fir_document", columnDefinition = "TEXT")
    private String firDocument;

    @Column(name = "fir_document_name")
    private String firDocumentName;

    @Column(name = "case_documents", columnDefinition = "TEXT")
    private String caseDocuments;

    @Column(name = "case_document_names", columnDefinition = "TEXT")
    private String caseDocumentNames;

    @Column(name = "filed_date")
    private LocalDateTime filedDate;

    @Column(name = "hearing_date")
    private LocalDateTime hearingDate;

    @Column(name = "court_name")
    private String courtName;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private User client;

    @ManyToOne
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;

    @ManyToOne
    @JoinColumn(name = "ngo_id")
    private NgoProfile ngo;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}