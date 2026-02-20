package com.teamthree.legalaid.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LawyerDTO {
    private Long lawyerId;
    private String fullName;
    private String specialization;
    private Integer experienceYears;
    private Boolean isAvailable;
    private String email;
    private Long assignedCasesCount;
}