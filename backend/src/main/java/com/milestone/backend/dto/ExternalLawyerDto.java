package com.milestone.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ExternalLawyerDto {

    private String name;           // Lawyer's full name
    private String city;           // City/location
    private String practiceArea;   // e.g. "Criminal Law", "Family Law"
    private String verificationStatus; // e.g. "Verified", "Pending"
    private String barCouncilId;   // Optional: Bar Council registration number
}
