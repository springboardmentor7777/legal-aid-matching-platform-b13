package com.legalmatch.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "advocate_directory")
public class Advocate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private String specialization;

    private String location;

    @Column(name = "contact_info")
    private String contactInfo;

    private Boolean verified;
}