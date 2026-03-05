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
    private Long userId;  // Add this field for the create case functionality
    
    @Column(name = "case_title")
    private String caseTitle;
    
    @Column(name = "title")  // Add this if you have a title column
    private String title;
    
    @Column(name = "case_description")
    private String caseDescription;
    
    @Column(name = "description")  // Add this if you have a description column
    private String description;
    
    @Column(name = "category")
    private String category;

    @Column(name = "location")
    private String location;

    private String status;
    
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