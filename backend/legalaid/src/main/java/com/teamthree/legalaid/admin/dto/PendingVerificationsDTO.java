package com.teamthree.legalaid.admin.dto;
 
import lombok.Builder;
import lombok.Data;
 
import java.util.List;
 
@Data
@Builder
public class PendingVerificationsDTO {
    private List<PendingLawyerDTO> pendingLawyers;
    private List<PendingNgoDTO> pendingNgos;
    private int totalPending;
 
    @Data
    @Builder
    public static class PendingLawyerDTO {
        private Long profileId;
        private Long userId;
        private String fullName;
        private String email;
        private String specialization;
        private String expertise;
        private String location;
        private String contactInfo;
        private Integer experienceYears;
        private Boolean verified;
    }
 
    @Data
    @Builder
    public static class PendingNgoDTO {
        private Long profileId;
        private Long userId;
        private String fullName;
        private String email;
        private String organizationName;
        private String registrationNumber;
        private String expertise;
        private String location;
        private String contactInfo;
        private Boolean verified;
    }
}
 