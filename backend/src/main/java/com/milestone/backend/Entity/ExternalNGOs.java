package com.milestone.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "external_ngo_directory",
       indexes = {
           @Index(name = "idx_lawyer_location", columnList = "location")
       })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExternalNGOs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String location;

    private Boolean verified;

    private String organizationName;

    private String serviceLocation;

}

