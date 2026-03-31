package com.teamthree.legalaid.admin.dto;
 
import lombok.Builder;
import lombok.Data;
 
import java.time.LocalDateTime;
 
@Data
@Builder
public class AdminUserDTO {
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private boolean enabled;
    private String provider;
    private LocalDateTime createdAt;
 
    // Lawyer-specific (null for non-lawyers)
    private Boolean lawyerVerified;
    private String specialization;
    private String lawyerLocation;
 
    // NGO-specific (null for non-NGOs)
    private Boolean ngoVerified;
    private String organizationName;
    private String ngoLocation;
}
