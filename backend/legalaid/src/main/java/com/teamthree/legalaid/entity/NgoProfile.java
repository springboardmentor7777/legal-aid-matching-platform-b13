package com.teamthree.legalaid.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ngo_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NgoProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "organization_name")
    private String organizationName;

    @Column(name = "registration_number")
    private String registrationNumber;

    @Column(name = "is_active")
    private Boolean isActive = true;
}