package com.teamthree.legalaid.dashboard.service;

import com.teamthree.legalaid.dto.RecentUserDTO;
import com.teamthree.legalaid.dashboard.dto.DashboardStatsDTO;
import com.teamthree.legalaid.dto.RecentCaseDTO;
import com.teamthree.legalaid.entity.Role;
import com.teamthree.legalaid.repository.UserRepository;
import com.teamthree.legalaid.repository.CaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final CaseRepository caseRepository;

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        
        stats.setTotalUsers(userRepository.count());
        stats.setTotalLawyers(userRepository.countByRole(Role.LAWYER));
        stats.setTotalNgos(userRepository.countByRole(Role.NGO));
        stats.setTotalCases(caseRepository.count());
        stats.setActiveCases(caseRepository.countByStatus("ACTIVE"));
        stats.setResolvedCases(caseRepository.countByStatus("RESOLVED"));
        stats.setPendingCases(caseRepository.countByStatus("PENDING"));
        
        return stats;
    }

    public List<RecentUserDTO> getRecentUsers() {
        return userRepository.findTop10ByOrderByCreatedAtDesc()
            .stream()
            .map(user -> new RecentUserDTO(
                user.getId(),
                user.getFullname(),
                user.getEmail(),
                user.getRole().name(),
                user.getCreatedAt()
            ))
            .collect(Collectors.toList());
    }

    public List<RecentCaseDTO> getRecentCases() {
        return caseRepository.findTop10ByOrderByFiledDateDesc()
            .stream()
            .map(case_ -> new RecentCaseDTO(
                case_.getId(),
                case_.getCaseTitle(),
                case_.getStatus(),
                case_.getFiledDate(),
                case_.getAssignedTo() != null ? case_.getAssignedTo().getFullname() : "Unassigned"
            ))
            .collect(Collectors.toList());
    }

    public Map<String, Long> getUsersByRole() {
        Map<String, Long> roleCounts = new HashMap<>();
        roleCounts.put("ADMIN", userRepository.countByRole(Role.ADMIN));
        roleCounts.put("LAWYER", userRepository.countByRole(Role.LAWYER));
        roleCounts.put("NGO", userRepository.countByRole(Role.NGO));
        roleCounts.put("USER", userRepository.countByRole(Role.USER));
        return roleCounts;
    }

    public Map<String, Object> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", LocalDateTime.now());
        health.put("database", "Connected");
        health.put("totalUsers", userRepository.count());
        health.put("totalCases", caseRepository.count());
        return health;
    }

    public List<Map<String, Object>> getRecentActivities() {
        List<Object[]> activities = caseRepository.findRecentActivities();
        
        return activities.stream()
            .map(activity -> {
                Map<String, Object> map = new HashMap<>();
                // Access array elements by index based on your query
                // Assuming the query returns: [id, type, description, timestamp, user]
                map.put("id", activity[0]);           // id
                map.put("type", activity[1]);          // type
                map.put("description", activity[2]);   // description
                map.put("timestamp", activity[3]);     // timestamp
                map.put("user", activity[4]);          // user name
                return map;
            })
            .collect(Collectors.toList());
    }
}