package com.teamthree.legalaid.admin.service;

import com.teamthree.legalaid.admin.dto.*;
import com.teamthree.legalaid.admin.dto.PendingVerificationsDTO.PendingLawyerDTO;
import com.teamthree.legalaid.admin.dto.PendingVerificationsDTO.PendingNgoDTO;
import com.teamthree.legalaid.entity.*;
import com.teamthree.legalaid.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminManagementService {

   private final UserRepository        userRepository;
   private final CaseRepository        caseRepository;
   private final LawyerRepository      lawyerRepository;
   private final NgoProfileRepository  ngoProfileRepository;
   private final AppointmentRepository appointmentRepository;
   private final MessageRepository     messageRepository;
   private final MatchRepository       matchRepository;

   // ─── GET /admin/users ────────────────────────────────────────────────────

   public List<AdminUserDTO> getAllUsers() {
       List<User> users = userRepository.findAll();

       // Build lookup maps so we only query each profile table once
       Map<Long, LawyerProfile> lawyerMap = lawyerRepository.findAll()
               .stream().collect(Collectors.toMap(lp -> lp.getUser().getId(), lp -> lp));

       Map<Long, NgoProfile> ngoMap = ngoProfileRepository.findAll()
               .stream().collect(Collectors.toMap(np -> np.getUser().getId(), np -> np));

       return users.stream().map(u -> {
           AdminUserDTO.AdminUserDTOBuilder b = AdminUserDTO.builder()
                   .id(u.getId())
                   .fullName(u.getFullname())
                   .email(u.getEmail())
                   .role(u.getRole().name())
                   .enabled(u.isEnabled())
                   .provider(u.getProvider())
                   .createdAt(u.getCreatedAt());

           if (u.getRole() == Role.LAWYER) {
               LawyerProfile lp = lawyerMap.get(u.getId());
               if (lp != null) {
                   b.lawyerVerified(lp.getVerified())
                    .specialization(lp.getSpecialization())
                    .lawyerLocation(lp.getLocation());
               }
           } else if (u.getRole() == Role.NGO) {
               NgoProfile np = ngoMap.get(u.getId());
               if (np != null) {
                   b.ngoVerified(np.getVerified())
                    .organizationName(np.getOrganizationName())
                    .ngoLocation(np.getLocation());
               }
           }
           return b.build();
       }).collect(Collectors.toList());
   }

   // ─── PUT /admin/users/{id}/status ────────────────────────────────────────

   @Transactional
   public Map<String, Object> updateUserStatus(Long userId, boolean enabled) {
       User user = userRepository.findById(userId)
               .orElseThrow(() -> new RuntimeException("User not found: " + userId));

       user.setEnabled(enabled);
       userRepository.save(user);

       Map<String, Object> response = new LinkedHashMap<>();
       response.put("success", true);
       response.put("userId", userId);
       response.put("enabled", enabled);
       response.put("message", "User " + user.getFullname() + " has been " + (enabled ? "enabled" : "disabled"));
       return response;
   }

   // ─── GET /admin/verifications ─────────────────────────────────────────────

   public PendingVerificationsDTO getPendingVerifications() {
       // Return ALL lawyers and NGOs so the admin can see both verified and unverified
       List<PendingLawyerDTO> lawyers = lawyerRepository.findAll().stream()
               .map(lp -> PendingLawyerDTO.builder()
                       .profileId(lp.getId())
                       .userId(lp.getUser().getId())
                       .fullName(lp.getUser().getFullname())
                       .email(lp.getUser().getEmail())
                       .specialization(lp.getSpecialization())
                       .expertise(lp.getExpertise())
                       .location(lp.getLocation())
                       .contactInfo(lp.getContactInfo())
                       .experienceYears(lp.getExperienceYears())
                       .verified(lp.getVerified())
                       .build())
               .collect(Collectors.toList());

       List<PendingNgoDTO> ngos = ngoProfileRepository.findAll().stream()
               .map(np -> PendingNgoDTO.builder()
                       .profileId(np.getId())
                       .userId(np.getUser().getId())
                       .fullName(np.getUser().getFullname())
                       .email(np.getUser().getEmail())
                       .organizationName(np.getOrganizationName())
                       .registrationNumber(np.getRegistrationNumber())
                       .expertise(np.getExpertise())
                       .location(np.getLocation())
                       .contactInfo(np.getContactInfo())
                       .verified(np.getVerified())
                       .build())
               .collect(Collectors.toList());

       long pendingCount = lawyers.stream().filter(l -> !Boolean.TRUE.equals(l.getVerified())).count()
                         + ngos.stream().filter(n -> !Boolean.TRUE.equals(n.getVerified())).count();

       return PendingVerificationsDTO.builder()
               .pendingLawyers(lawyers)
               .pendingNgos(ngos)
               .totalPending((int) pendingCount)
               .build();
   }

   // ─── PUT /admin/verify/lawyer/{id} ────────────────────────────────────────

   @Transactional
   public Map<String, Object> verifyLawyer(Long profileId, boolean verified) {
       LawyerProfile profile = lawyerRepository.findById(profileId)
               .orElseThrow(() -> new RuntimeException("Lawyer profile not found: " + profileId));

       profile.setVerified(verified);
       lawyerRepository.save(profile);

       Map<String, Object> response = new LinkedHashMap<>();
       response.put("success", true);
       response.put("profileId", profileId);
       response.put("verified", verified);
       response.put("message", "Lawyer " + profile.getUser().getFullname() +
               " has been " + (verified ? "verified" : "unverified"));
       return response;
   }

   // ─── PUT /admin/verify/ngo/{id} ───────────────────────────────────────────

   @Transactional
   public Map<String, Object> verifyNgo(Long profileId, boolean verified) {
       NgoProfile profile = ngoProfileRepository.findById(profileId)
               .orElseThrow(() -> new RuntimeException("NGO profile not found: " + profileId));

       profile.setVerified(verified);
       ngoProfileRepository.save(profile);

       Map<String, Object> response = new LinkedHashMap<>();
       response.put("success", true);
       response.put("profileId", profileId);
       response.put("verified", verified);
       response.put("message", "NGO " + profile.getOrganizationName() +
               " has been " + (verified ? "verified" : "unverified"));
       return response;
   }

   // ─── GET /admin/cases ─────────────────────────────────────────────────────

   public List<AdminCaseDTO> getAllCases() {
       return caseRepository.findAll().stream()
               .sorted(Comparator.comparing(
                       c -> c.getCreatedAt() != null ? c.getCreatedAt() : LocalDateTime.MIN,
                       Comparator.reverseOrder()))
               .map(c -> AdminCaseDTO.builder()
                       .id(c.getId())
                       .caseTitle(c.getCaseTitle() != null ? c.getCaseTitle() : c.getTitle())
                       .category(c.getCategory())
                       .status(c.getStatus())
                       .location(c.getLocation())
                       .clientId(c.getClient() != null ? c.getClient().getId() : c.getUserId())
                       .clientName(c.getClient() != null ? c.getClient().getFullname() : null)
                       .clientEmail(c.getClient() != null ? c.getClient().getEmail() : null)
                       .assignedToId(c.getAssignedTo() != null ? c.getAssignedTo().getId() : null)
                       .assignedToName(c.getAssignedTo() != null ? c.getAssignedTo().getFullname() : null)
                       .ngoId(c.getNgo() != null ? c.getNgo().getId() : null)
                       .ngoName(c.getNgo() != null ? c.getNgo().getOrganizationName() : null)
                       .createdAt(c.getCreatedAt())
                       .updatedAt(c.getUpdatedAt())
                       .hearingDate(c.getHearingDate())
                       .build())
               .collect(Collectors.toList());
   }

   // ─── GET /admin/system/logs ───────────────────────────────────────────────

   public List<SystemLogDTO> getSystemLogs() {
       // Pull recent case activity from the existing native query in CaseRepository
       List<Object[]> caseActivities = caseRepository.findRecentActivities();

       List<SystemLogDTO> logs = new ArrayList<>();

       for (Object[] row : caseActivities) {
           // row: [id, type, description, timestamp, user]
           logs.add(SystemLogDTO.builder()
                   .id(row[0] != null ? ((Number) row[0]).longValue() : null)
                   .type(row[1] != null ? row[1].toString() : "UNKNOWN")
                   .description(row[2] != null ? row[2].toString() : "")
                   .timestamp(row[3] != null ? toLocalDateTime(row[3]) : null)
                   .actorName(row[4] != null ? row[4].toString() : "System")
                   .build());
       }

       // Sort by timestamp descending
       logs.sort(Comparator.comparing(
               SystemLogDTO::getTimestamp,
               Comparator.nullsLast(Comparator.reverseOrder())));

       return logs;
   }

   // ─── GET /admin/health ────────────────────────────────────────────────────

   public SystemHealthDTO getSystemHealth() {
       Runtime rt = Runtime.getRuntime();
       long usedMemoryMb  = (rt.totalMemory() - rt.freeMemory()) / (1024 * 1024);
       long totalMemoryMb = rt.totalMemory() / (1024 * 1024);
       long maxMemoryMb   = rt.maxMemory() / (1024 * 1024);

       long pendingLawyers = lawyerRepository.findAll().stream()
               .filter(lp -> !Boolean.TRUE.equals(lp.getVerified())).count();
       long pendingNgos = ngoProfileRepository.findAll().stream()
               .filter(np -> !Boolean.TRUE.equals(np.getVerified())).count();
       long openCases = caseRepository.countByStatus("OPEN") + caseRepository.countByStatus("PENDING");
       long pendingAppts = appointmentRepository.findAll().stream()
               .filter(a -> "PENDING".equalsIgnoreCase(a.getStatus())).count();

       Map<String, Object> jvm = new LinkedHashMap<>();
       jvm.put("usedMemoryMb",  usedMemoryMb);
       jvm.put("totalMemoryMb", totalMemoryMb);
       jvm.put("maxMemoryMb",   maxMemoryMb);
       jvm.put("availableProcessors", rt.availableProcessors());
       jvm.put("javaVersion", System.getProperty("java.version"));

       return SystemHealthDTO.builder()
               .status("UP")
               .checkedAt(LocalDateTime.now())
               .totalUsers(userRepository.count())
               .totalCases(caseRepository.count())
               .totalMatches(matchRepository.count())
               .totalMessages(messageRepository.count())
               .totalAppointments(appointmentRepository.count())
               .pendingLawyerVerifications(pendingLawyers)
               .pendingNgoVerifications(pendingNgos)
               .openCases(openCases)
               .pendingAppointments(pendingAppts)
               .jvm(jvm)
               .build();
   }

   // ─── Helpers ──────────────────────────────────────────────────────────────

   private LocalDateTime toLocalDateTime(Object obj) {
       if (obj instanceof LocalDateTime ldt) return ldt;
       if (obj instanceof java.sql.Timestamp ts) return ts.toLocalDateTime();
       if (obj instanceof java.sql.Date d) return d.toLocalDate().atStartOfDay();
       return null;
   }
}
