package com.teamthree.legalaid.analytics.controller;

import com.teamthree.legalaid.analytics.dto.*;
import com.teamthree.legalaid.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    /** Platform-wide KPI snapshot */
    @GetMapping("/overview")
    public ResponseEntity<AnalyticsOverviewDTO> getOverview() {
        return ResponseEntity.ok(analyticsService.getOverview());
    }

    /** User counts, role distribution pie data, monthly registration trend */
    @GetMapping("/users")
    public ResponseEntity<UserAnalyticsDTO> getUserAnalytics() {
        return ResponseEntity.ok(analyticsService.getUserAnalytics());
    }

    /** Case counts, category bar chart, status breakdown, location data, trend */
    @GetMapping("/cases")
    public ResponseEntity<CaseAnalyticsDTO> getCaseAnalytics() {
        return ResponseEntity.ok(analyticsService.getCaseAnalytics());
    }

    /** Match counts, lawyer vs NGO split, status breakdown, trend */
    @GetMapping("/matches")
    public ResponseEntity<MatchAnalyticsDTO> getMatchAnalytics() {
        return ResponseEntity.ok(analyticsService.getMatchAnalytics());
    }

    /** Appointments & chat/message activity with monthly trends */
    @GetMapping("/activity")
    public ResponseEntity<ActivityAnalyticsDTO> getActivityAnalytics() {
        return ResponseEntity.ok(analyticsService.getActivityAnalytics());
    }
}
