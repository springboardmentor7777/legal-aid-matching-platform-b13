package com.teamthree.legalaid.dashboard.controller;

import com.teamthree.legalaid.dashboard.dto.LawyerDashboardDTO;
import com.teamthree.legalaid.dashboard.service.LawyerDashboardService;
import com.teamthree.legalaid.dto.CaseDTO;
import com.teamthree.legalaid.dto.ScheduleDTO;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/lawyer/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('LAWYER')")
public class LawyerDashboardController {

    private final LawyerDashboardService lawyerDashboardService;
    private final UserRepository userRepository;

    private User resolveUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + userDetails.getUsername()));
    }

    @GetMapping("/overview")
    public ResponseEntity<LawyerDashboardDTO> getDashboardOverview(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(lawyerDashboardService.getDashboardOverview(resolveUser(userDetails)));
    }

    @GetMapping("/cases/assigned")
    public ResponseEntity<List<CaseDTO>> getAssignedCases(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(lawyerDashboardService.getAssignedCases(resolveUser(userDetails)));
    }

    @GetMapping("/cases/completed")
    public ResponseEntity<List<CaseDTO>> getCompletedCases(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(lawyerDashboardService.getCompletedCases(resolveUser(userDetails)));
    }

    @GetMapping("/cases/pending")
    public ResponseEntity<List<CaseDTO>> getPendingCases(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(lawyerDashboardService.getPendingCases(resolveUser(userDetails)));
    }

    @GetMapping("/schedule/today")
    public ResponseEntity<List<ScheduleDTO>> getTodaySchedule(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(lawyerDashboardService.getTodaySchedule(resolveUser(userDetails)));
    }

    @PutMapping("/availability")
    public ResponseEntity<?> updateAvailability(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Boolean> availability) {
        return ResponseEntity.ok(lawyerDashboardService.updateAvailability(
            resolveUser(userDetails), availability.get("isAvailable")));
    }
}