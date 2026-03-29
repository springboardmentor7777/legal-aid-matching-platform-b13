package com.milestone.backend.service;

import org.springframework.stereotype.Service;
import com.milestone.backend.dto.AnalyticsOverviewResponse;
import com.milestone.backend.entity.CaseStatus;
import com.milestone.backend.entity.Role;
import com.milestone.backend.repository.CaseRepository;
import com.milestone.backend.repository.MatchRepository;
import com.milestone.backend.repository.UserRepository;

@Service
public class AnalyticsService {

    private final UserRepository userRepository;
    private final CaseRepository caseRepository;
    private final MatchRepository matchRepository;

    public AnalyticsService(UserRepository userRepository, CaseRepository caseRepository, MatchRepository matchRepository) {
        this.userRepository = userRepository;
        this.caseRepository = caseRepository;
        this.matchRepository = matchRepository;
    }

    public AnalyticsOverviewResponse getOverviewMetrics() {
        AnalyticsOverviewResponse response = new AnalyticsOverviewResponse();

        // 1. User Metrics
        response.setTotalUsers(userRepository.count());
        response.setTotalLawyers(userRepository.countByRole(Role.LAWYER));
        response.setTotalNgos(userRepository.countByRole(Role.NGO));

        // 2. Case & Match Metrics
        response.setTotalCases(caseRepository.count());
        response.setTotalMatches(matchRepository.count());
        response.setResolvedCases(caseRepository.countByStatus(CaseStatus.RESOLVED));

        return response;
    }

    // Fetch case category distribution
    public java.util.List<com.milestone.backend.dto.CategoryCountDto> getCasesByCategory() {
        return caseRepository.countCasesByCategory();
    }

    // Fetch user role distribution
    public java.util.List<com.milestone.backend.dto.RoleCountDto> getUsersByRole() {
        return userRepository.countUsersByRole();
    }

    // Fetch match status distribution
    public java.util.List<com.milestone.backend.dto.MatchStatusCountDto> getMatchesByStatus() {
        return matchRepository.countMatchesByStatus();
    }

    // Fetch case geographic distribution
    public java.util.List<com.milestone.backend.dto.LocationCountDto> getActivityByLocation() {
        return caseRepository.countCasesByLocation();
    }
}