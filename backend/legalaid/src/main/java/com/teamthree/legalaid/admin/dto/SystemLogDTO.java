package com.teamthree.legalaid.admin.dto;
 
import lombok.Builder;
import lombok.Data;
 
import java.time.LocalDateTime;
 
@Data
@Builder
public class SystemLogDTO {
    private Long id;
    private String type;        // CASE_CREATED, USER_REGISTERED, MATCH_MADE, etc.
    private String description;
    private String actorName;   // who triggered the event
    private String actorRole;
    private LocalDateTime timestamp;
}
 