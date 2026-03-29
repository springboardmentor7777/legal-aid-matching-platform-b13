package com.milestone.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.milestone.backend.dto.AnalyticsOverviewResponse;
import com.milestone.backend.service.AnalyticsService;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/overview")
    public ResponseEntity<AnalyticsOverviewResponse> getOverview() {
        return ResponseEntity.ok(analyticsService.getOverviewMetrics());
    }

    @GetMapping("/cases")
    public ResponseEntity<java.util.List<com.milestone.backend.dto.CategoryCountDto>> getCasesAnalytics() {
        return ResponseEntity.ok(analyticsService.getCasesByCategory());
    }

    @GetMapping("/users")
    public ResponseEntity<java.util.List<com.milestone.backend.dto.RoleCountDto>> getUsersAnalytics() {
        return ResponseEntity.ok(analyticsService.getUsersByRole());
    }

    @GetMapping("/matches")
    public ResponseEntity<java.util.List<com.milestone.backend.dto.MatchStatusCountDto>> getMatchesAnalytics() {
        return ResponseEntity.ok(analyticsService.getMatchesByStatus());
    }

    @GetMapping("/activity")
    public ResponseEntity<java.util.List<com.milestone.backend.dto.LocationCountDto>> getActivityAnalytics() {
        return ResponseEntity.ok(analyticsService.getActivityByLocation());
    }
}