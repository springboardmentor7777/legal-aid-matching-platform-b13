package com.legalmatch.backend.service;

import com.legalmatch.backend.entity.*;
import com.legalmatch.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Administrative operations including platform analytics, provider verification,
 * user suspension, audit logging, and CSV data export.
 */
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final CaseRepository caseRepository;
    private final MatchRepository matchRepository;
    private final LawyerProfileRepository lawyerProfileRepository;
    private final NGOProfileRepository ngoProfileRepository;
    private final AuditLogRepository auditLogRepository;
    private final MessageRepository messageRepository;

    /**
     * Aggregates platform-wide KPIs for the admin dashboard, including user counts,
     * case statistics, match metrics, provider verification state, and chart data.
     */
    public Map<String, Object> getAdminStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalCases", caseRepository.count());
        stats.put("totalMatches", matchRepository.count());
        stats.put("lawyers", userRepository.countByRole(Role.LAWYER));
        stats.put("ngos", userRepository.countByRole(Role.NGO));
        stats.put("citizens", userRepository.countByRole(Role.CITIZEN));

        long pendingLawyers = lawyerProfileRepository.findByVerifiedFalseOrVerifiedIsNull().size();
        long pendingNgos = ngoProfileRepository.findByVerifiedFalseOrVerifiedIsNull().size();
        stats.put("pendingVerifications", pendingLawyers + pendingNgos);

        long resolvedCases = caseRepository.findAll().stream()
                .filter(c -> c.getStatus() == CaseStatus.RESOLVED)
                .count();
        stats.put("totalResolvedCases", resolvedCases);

        stats.put("chatActivitySummary", messageRepository.count());

        Map<String, Long> casesByCategory = caseRepository.findAll().stream()
                .filter(c -> c.getCaseType() != null)
                .collect(Collectors.groupingBy(Case::getCaseType, Collectors.counting()));
        stats.put("casesByCategory", casesByCategory);

        List<Map<String, Object>> roleDistribution = new ArrayList<>();
        roleDistribution.add(Map.of("name", "Citizens", "value", userRepository.countByRole(Role.CITIZEN)));
        roleDistribution.add(Map.of("name", "Lawyers", "value", userRepository.countByRole(Role.LAWYER)));
        roleDistribution.add(Map.of("name", "NGOs", "value", userRepository.countByRole(Role.NGO)));
        stats.put("roleDistribution", roleDistribution);

        return stats;
    }

    /**
     * Exports all cases to a CSV-formatted string for download.
     */
    public String exportCasesToCsv() {
        List<Case> cases = caseRepository.findAll();
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);

        pw.println("ID,Case Type,Description,Urgency,Location,Status,Jurisdiction State,Jurisdiction City,Court,Created At");

        for (Case c : cases) {
            pw.printf("%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"%n",
                    c.getId(),
                    escapeCsv(c.getCaseType()),
                    escapeCsv(truncate(c.getDescription(), 200)),
                    escapeCsv(c.getUrgency()),
                    escapeCsv(c.getLocation()),
                    c.getStatus() != null ? c.getStatus().name() : "",
                    escapeCsv(c.getJurisdictionState()),
                    escapeCsv(c.getJurisdictionCity()),
                    escapeCsv(c.getCourtName()),
                    c.getCreatedAt() != null ? c.getCreatedAt().toString() : ""
            );
        }

        pw.flush();
        return sw.toString();
    }

    /**
     * Returns all unverified Lawyer and NGO profiles awaiting admin review.
     */
    public List<Map<String, Object>> getPendingVerifications() {
        List<Map<String, Object>> pending = new ArrayList<>();

        for (LawyerProfile lp : lawyerProfileRepository.findByVerifiedFalseOrVerifiedIsNull()) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("profileId", lp.getId());
            item.put("userId", lp.getUser().getId());
            item.put("type", "LAWYER");
            item.put("name", lp.getName());
            item.put("email", lp.getUser().getEmail());
            item.put("expertise", lp.getExpertise());
            item.put("location", lp.getLocation());
            item.put("barCouncilLicense", lp.getBarCouncilLicense());
            item.put("verified", lp.getVerified());
            pending.add(item);
        }

        for (NGOProfile np : ngoProfileRepository.findByVerifiedFalseOrVerifiedIsNull()) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("profileId", np.getId());
            item.put("userId", np.getUser().getId());
            item.put("type", "NGO");
            item.put("name", np.getOrganizationName());
            item.put("email", np.getUser().getEmail());
            item.put("expertise", np.getFocusArea());
            item.put("location", np.getLocation());
            item.put("barCouncilLicense", np.getNgoDarpanId());
            item.put("verified", np.getVerified());
            pending.add(item);
        }

        return pending;
    }

    /**
     * Approves or rejects a provider's verification status and logs the action.
     *
     * @param userId  the user ID of the provider
     * @param approve true to approve, false to reject
     * @return result map with status, type, and email
     */
    @Transactional
    public Map<String, Object> verifyProvider(Long userId, boolean approve) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        String action = approve ? "APPROVED" : "REJECTED";

        Optional<LawyerProfile> lawyerOpt = lawyerProfileRepository.findByUser(user);
        if (lawyerOpt.isPresent()) {
            lawyerOpt.get().setVerified(approve);
            lawyerProfileRepository.save(lawyerOpt.get());

            logAudit("PROVIDER_" + action, "INFO", "AdminService",
                    "Lawyer profile " + action.toLowerCase() + ": " + user.getEmail(), userId);

            return Map.of("status", action, "type", "LAWYER", "email", user.getEmail());
        }

        Optional<NGOProfile> ngoOpt = ngoProfileRepository.findByUser(user);
        if (ngoOpt.isPresent()) {
            ngoOpt.get().setVerified(approve);
            ngoProfileRepository.save(ngoOpt.get());

            logAudit("PROVIDER_" + action, "INFO", "AdminService",
                    "NGO profile " + action.toLowerCase() + ": " + user.getEmail(), userId);

            return Map.of("status", action, "type", "NGO", "email", user.getEmail());
        }

        throw new RuntimeException("No lawyer or NGO profile found for user: " + userId);
    }

    /**
     * Toggles user suspension state and logs the administrative action.
     */
    @Transactional
    public Map<String, Object> toggleSuspendUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        boolean newState = !(user.getSuspended() != null && user.getSuspended());
        user.setSuspended(newState);
        userRepository.save(user);

        String action = newState ? "SUSPENDED" : "REINSTATED";
        logAudit("USER_" + action, newState ? "WARN" : "INFO", "AdminService",
                "User " + action.toLowerCase() + ": " + user.getEmail(), userId);

        return Map.of(
                "userId", userId,
                "email", user.getEmail(),
                "suspended", newState,
                "status", action
        );
    }

    /**
     * Returns all platform users for the admin user management table.
     */
    public List<Map<String, Object>> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", user.getId());
                    map.put("username", user.getUsername());
                    map.put("email", user.getEmail());
                    map.put("role", user.getRole().name());
                    map.put("onboardingComplete", user.getOnboardingComplete() != null ? user.getOnboardingComplete() : false);
                    map.put("suspended", user.getSuspended() != null ? user.getSuspended() : false);
                    return map;
                })
                .collect(Collectors.toList());
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop50ByOrderByCreatedAtDesc();
    }

    public void logAudit(String eventType, String severity, String source, String message, Long userId) {
        AuditLog log = AuditLog.builder()
                .eventType(eventType)
                .severity(severity)
                .source(source)
                .message(message)
                .userId(userId)
                .build();
        auditLogRepository.save(log);
    }

    /**
     * Returns all cases with match status for the admin case monitoring view.
     */
    public List<Map<String, Object>> getAllCasesForAdmin() {
        return caseRepository.findAll().stream()
                .map(c -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", c.getId());
                    map.put("caseType", c.getCaseType());
                    map.put("description", truncate(c.getDescription(), 120));
                    map.put("urgency", c.getUrgency());
                    map.put("status", c.getStatus() != null ? c.getStatus().name() : "UNKNOWN");
                    map.put("citizenName", c.getUser() != null ? c.getUser().getUsername() : "—");
                    map.put("citizenEmail", c.getUser() != null ? c.getUser().getEmail() : "—");
                    map.put("location", c.getLocation());
                    map.put("createdAt", c.getCreatedAt() != null ? c.getCreatedAt().toString() : "");

                    List<MatchEntity> matches = matchRepository.findByLegalCase(c);
                    if (matches.isEmpty()) {
                        map.put("matchStatus", "UNMATCHED");
                    } else {
                        boolean hasAccepted = matches.stream().anyMatch(m -> m.getStatus() == MatchStatus.ACCEPTED);
                        map.put("matchStatus", hasAccepted ? "MATCHED" : "PENDING");
                    }

                    return map;
                })
                .collect(Collectors.toList());
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        return value.replace("\"", "\"\"").replace("\n", " ").replace("\r", " ");
    }

    private String truncate(String value, int maxLength) {
        if (value == null) return "";
        return value.length() > maxLength ? value.substring(0, maxLength) + "..." : value;
    }
}
