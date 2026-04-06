package com.legalmatch.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "jurisdictions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Jurisdiction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String state;

    private String city;

    @Column(name = "court_name", nullable = false)
    private String courtName;
}
