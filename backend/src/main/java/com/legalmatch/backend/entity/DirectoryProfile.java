package com.legalmatch.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "directory_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DirectoryProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String organizationName;

    private String expertise;

    private String location;

    private boolean verified;

    @Column(length = 1000)
    private String bio;
}