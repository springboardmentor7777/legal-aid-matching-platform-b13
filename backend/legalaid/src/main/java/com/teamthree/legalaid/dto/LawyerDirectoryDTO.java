package com.teamthree.legalaid.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LawyerDirectoryDTO {
    private Long id;
    private String name;
    private String email;
    private String specialization;
    private String expertise;
    private String location;
    private Boolean verified;
    private String contactInfo;
    private Integer experienceYears;
    private Boolean isAvailable;
}