package com.legalmatch.backend.dto;

import lombok.Data;

@Data
public class OnboardingRequest {

    // Common fields
    private String state;
    private String city;
    private String officeAddress;

    // Lawyer-specific
    private String practiceAreas;
    private String barCouncilLicense;
    private String licenseDocumentName;

    // NGO-specific
    private String focusAreas;
    private String ngoDarpanId;
    private String registrationCertName;
}
