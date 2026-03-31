package com.teamthree.legalaid.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminCaseDTO {
   private Long id;
   private String caseTitle;
   private String category;
   private String status;
   private String location;

   // Client info
   private Long clientId;
   private String clientName;
   private String clientEmail;

   // Assignment info
   private Long assignedToId;
   private String assignedToName;

   // NGO info
   private Long ngoId;
   private String ngoName;

   private LocalDateTime createdAt;
   private LocalDateTime updatedAt;
   private LocalDateTime hearingDate;
}

