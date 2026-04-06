package com.legalmatch.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ngo_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NGOProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String organizationName;

    private String focusArea;

    private String location;

    private Boolean verified;

    @Column(name = "contact_info")
    private String contactInfo;

    private String state;

    private String city;

    @Column(columnDefinition = "TEXT")
    private String focusAreas;

    @Column(columnDefinition = "TEXT")
    private String officeAddress;

    @Column(name = "ngo_darpan_id")
    private String ngoDarpanId;

    @Column(name = "registration_cert_name")
    private String registrationCertName;
}