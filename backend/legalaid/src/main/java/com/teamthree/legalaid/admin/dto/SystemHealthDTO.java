package com.teamthree.legalaid.admin.dto;
 
import lombok.Builder;
import lombok.Data;
 
import java.time.LocalDateTime;
import java.util.Map;
 
@Data
@Builder
public class SystemHealthDTO {
    private String status;          // UP / DEGRADED / DOWN
    private LocalDateTime checkedAt;
 
    // Database counts
    private long totalUsers;
    private long totalCases;
    private long totalMatches;
    private long totalMessages;
    private long totalAppointments;
 
    // Pending items
    private long pendingLawyerVerifications;
    private long pendingNgoVerifications;
    private long openCases;
    private long pendingAppointments;
 
    // JVM / runtime
    private Map<String, Object> jvm;
}
 