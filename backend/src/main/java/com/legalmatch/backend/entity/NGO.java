package com.legalmatch.backend.entity;



import jakarta.persistence.*;

@Entity
@Table(name = "ngo_directory")
public class NGO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "organization_name")
    private String name;

    @Column(name = "focus_area")
    private String category;

    private String location;

    @Column(name = "contact_info")
    private String contactInfo;

    private Boolean verified;

    // getters & setters
}