package com.milestone.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import static jakarta.persistence.GenerationType.IDENTITY;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ngo_directory",
       indexes = {
           @Index(name = "idx_ngo_location", columnList = "location"),
           @Index(name = "idx_ngo_expertise", columnList = "expertise")
       })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NgoDirectory {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    private String name;

    private String expertise;

    private String location;

    private Boolean verified;

    private String organizationDetails;


}
