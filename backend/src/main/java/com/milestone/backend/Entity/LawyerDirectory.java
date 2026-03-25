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
@Table(name = "lawyer_directory",
       indexes = {
           @Index(name = "idx_lawyer_location", columnList = "location"),
           @Index(name = "idx_lawyer_expertise", columnList = "expertise")
       })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LawyerDirectory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String expertise;

    private String location;

    private Boolean verified;

    private String organizationDetails;

}

