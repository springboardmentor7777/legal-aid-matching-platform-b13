package com.teamthree.legalaid.analytics.service;

import com.teamthree.legalaid.analytics.dto.*;
import com.teamthree.legalaid.analytics.repository.AnalyticsRepository;
import com.teamthree.legalaid.entity.Role;
import com.teamthree.legalaid.repository.AppointmentRepository;
import com.teamthree.legalaid.repository.MessageRepository;
import com.teamthree.legalaid.repository.MatchRepository;
import com.teamthree.legalaid.repository.UserRepository;
import com.teamthree.legalaid.repository.CaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final UserRepository        userRepository;
    private final CaseRepository        caseRepository;
    private final MatchRepository       matchRepository;
    private final AppointmentRepository appointmentRepository;
    private final MessageRepository     messageRepository;
    private final AnalyticsRepository   analyticsRepository;

    // ─────────────────────────────────────────────────────────────────────────
    // GET /analytics/overview
    // ─────────────────────────────────────────────────────────────────────────
    public AnalyticsOverviewDTO getOverview() {
        long totalMatches     = matchRepository.count();
        long matchedCases     = analyticsRepository.countMatchedCases();
        long activeChats      = analyticsRepository.countActiveChats();
        long totalMessages    = messageRepository.count();
        long totalAppointments = appointmentRepository.count();
        long activeAppointments = appointmentRepository.findAll().stream()
                .filter(a -> "PENDING".equalsIgnoreCase(a.getStatus())
                          || "CONFIRMED".equalsIgnoreCase(a.getStatus()))
                .count();

        return AnalyticsOverviewDTO.builder()
                .totalUsers(userRepository.count())
                .totalLawyers(userRepository.countByRole(Role.LAWYER))
                .totalNgos(userRepository.countByRole(Role.NGO))
                .totalAdmins(userRepository.countByRole(Role.ADMIN))
                .totalCases(caseRepository.count())
                .matchedCases(matchedCases)
                .resolvedCases(caseRepository.countByStatus("RESOLVED"))
                .activeCases(caseRepository.countByStatus("ACTIVE"))
                .pendingCases(caseRepository.countByStatus("PENDING"))
                .totalMatches(totalMatches)
                .activeAppointments(activeAppointments)
                .totalMessages(totalMessages)
                .totalAppointments(totalAppointments)
                .build();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /analytics/users
    // ─────────────────────────────────────────────────────────────────────────
    public UserAnalyticsDTO getUserAnalytics() {
        long totalLawyers  = userRepository.countByRole(Role.LAWYER);
        long totalNgos     = userRepository.countByRole(Role.NGO);
        long totalAdmins   = userRepository.countByRole(Role.ADMIN);
        long totalCitizens = userRepository.countByRole(Role.USER);
        long totalUsers    = userRepository.count();

        Map<String, Long> byRole = new LinkedHashMap<>();
        byRole.put("Citizens", totalCitizens);
        byRole.put("Lawyers",  totalLawyers);
        byRole.put("NGOs",     totalNgos);
        byRole.put("Admins",   totalAdmins);

        List<TrendPointDTO> trend = toTrendPoints(analyticsRepository.countNewUsersMonthly());

        return UserAnalyticsDTO.builder()
                .totalUsers(totalUsers)
                .totalLawyers(totalLawyers)
                .totalNgos(totalNgos)
                .totalCitizens(totalCitizens)
                .totalAdmins(totalAdmins)
                .byRole(byRole)
                .newUsersOverTime(trend)
                .build();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /analytics/cases
    // ─────────────────────────────────────────────────────────────────────────
    public CaseAnalyticsDTO getCaseAnalytics() {
        Map<String, Long> byCategory = toMap(analyticsRepository.countCasesByCategory());
        Map<String, Long> byStatus   = toMap(analyticsRepository.countCasesByStatus());
        List<TrendPointDTO> trend    = toTrendPoints(analyticsRepository.countNewCasesMonthly());
        List<LocationCountDTO> byLoc = buildLocationBreakdown();

        return CaseAnalyticsDTO.builder()
                .totalCases(caseRepository.count())
                .activeCases(caseRepository.countByStatus("ACTIVE"))
                .resolvedCases(caseRepository.countByStatus("RESOLVED"))
                .pendingCases(caseRepository.countByStatus("PENDING"))
                .matchedCases(analyticsRepository.countMatchedCases())
                .byCategory(byCategory)
                .byStatus(byStatus)
                .newCasesOverTime(trend)
                .byLocation(byLoc)
                .build();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /analytics/matches
    // ─────────────────────────────────────────────────────────────────────────
    public MatchAnalyticsDTO getMatchAnalytics() {
        Map<String, Long> byStatus      = toMap(analyticsRepository.countMatchesByStatus());
        Map<String, Long> byProfileType = toMap(analyticsRepository.countMatchesByProfileType());
        List<TrendPointDTO> trend       = toTrendPoints(analyticsRepository.countNewMatchesMonthly());

        long lawyerMatches = byProfileType.getOrDefault("LAWYER", 0L);
        long ngoMatches    = byProfileType.getOrDefault("NGO",    0L);

        return MatchAnalyticsDTO.builder()
                .totalMatches(matchRepository.count())
                .lawyerMatches(lawyerMatches)
                .ngoMatches(ngoMatches)
                .byStatus(byStatus)
                .matchesOverTime(trend)
                .build();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GET /analytics/activity
    // ─────────────────────────────────────────────────────────────────────────
    public ActivityAnalyticsDTO getActivityAnalytics() {
        long totalAppointments = appointmentRepository.count();
        long activeAppointments = appointmentRepository.findAll().stream()
                .filter(a -> "PENDING".equalsIgnoreCase(a.getStatus())
                          || "CONFIRMED".equalsIgnoreCase(a.getStatus()))
                .count();
        long completedAppointments = appointmentRepository.findAll().stream()
                .filter(a -> "COMPLETED".equalsIgnoreCase(a.getStatus()))
                .count();
        long totalMessages = messageRepository.count();
        long activeChats   = analyticsRepository.countActiveChats();

        List<TrendPointDTO> apptTrend = toTrendPoints(analyticsRepository.countAppointmentsMonthly());
        List<TrendPointDTO> msgTrend  = toTrendPoints(analyticsRepository.countMessagesMonthly());

        return ActivityAnalyticsDTO.builder()
                .totalAppointments(totalAppointments)
                .activeAppointments(activeAppointments)
                .completedAppointments(completedAppointments)
                .totalMessages(totalMessages)
                .activeChats(activeChats)
                .appointmentsOverTime(apptTrend)
                .messagesOverTime(msgTrend)
                .build();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────────────────

    /** Converts Object[]{label, count} rows → LinkedHashMap preserving order. */
    private Map<String, Long> toMap(List<Object[]> rows) {
        Map<String, Long> map = new LinkedHashMap<>();
        if (rows != null) {
            for (Object[] row : rows) {
                String key = row[0] != null ? row[0].toString() : "Unknown";
                Long   val = row[1] != null ? ((Number) row[1]).longValue() : 0L;
                map.put(key, val);
            }
        }
        return map;
    }

    /** Converts Object[]{period, count} rows → List<TrendPointDTO>. */
    private List<TrendPointDTO> toTrendPoints(List<Object[]> rows) {
        if (rows == null) return Collections.emptyList();
        return rows.stream()
                .map(row -> TrendPointDTO.builder()
                        .period(row[0] != null ? row[0].toString() : "")
                        .count(row[1]  != null ? ((Number) row[1]).longValue() : 0L)
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Merges case, lawyer, and NGO location counts into a single list.
     * Uses the location string as the join key (case-insensitive).
     */
    private List<LocationCountDTO> buildLocationBreakdown() {
        Map<String, Long> caseLoc   = toMap(analyticsRepository.countCasesByLocation());
        Map<String, Long> lawyerLoc = toMap(analyticsRepository.countLawyersByLocation());
        Map<String, Long> ngoLoc    = toMap(analyticsRepository.countNgosByLocation());

        // Union all location keys
        Set<String> allLocations = new LinkedHashSet<>();
        allLocations.addAll(caseLoc.keySet());
        allLocations.addAll(lawyerLoc.keySet());
        allLocations.addAll(ngoLoc.keySet());

        return allLocations.stream()
                .filter(loc -> loc != null && !loc.isBlank() && !"Unknown".equalsIgnoreCase(loc))
                .map(loc -> LocationCountDTO.builder()
                        .location(loc)
                        .caseCount(caseLoc.getOrDefault(loc, 0L))
                        .lawyerCount(lawyerLoc.getOrDefault(loc, 0L))
                        .ngoCount(ngoLoc.getOrDefault(loc, 0L))
                        .build())
                .sorted(Comparator.comparingLong(LocationCountDTO::getCaseCount).reversed())
                .collect(Collectors.toList());
    }
}
