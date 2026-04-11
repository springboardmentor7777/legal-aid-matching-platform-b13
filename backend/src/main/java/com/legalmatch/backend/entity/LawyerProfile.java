package com.legalmatch.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lawyer_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LawyerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String name;

    private String expertise;

    private String location;

    private Boolean verified;

    @Column(name = "contact_info")
    private String contactInfo;

    private String state;

    private String city;

    @Column(columnDefinition = "TEXT")
    private String practiceAreas;

    @Column(columnDefinition = "TEXT")
    private String officeAddress;

    @Column(name = "bar_council_license")
    private String barCouncilLicense;

    @Column(name = "license_document_name")
    private String licenseDocumentName;
}