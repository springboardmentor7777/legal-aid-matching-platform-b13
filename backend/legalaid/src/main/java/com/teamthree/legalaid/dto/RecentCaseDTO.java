package com.teamthree.legalaid.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecentCaseDTO {
    private Long caseId;
    private String caseTitle;
    private String status;
    private LocalDateTime filedDate;
    private String assignedTo;
    private String category;
    private String location;
}