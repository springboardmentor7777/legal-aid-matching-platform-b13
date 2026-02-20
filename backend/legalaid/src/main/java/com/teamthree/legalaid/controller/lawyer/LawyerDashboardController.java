package com.teamthree.legalaid.controller.lawyer;

import com.teamthree.legalaid.dto.LawyerDashboardDTO;
import com.teamthree.legalaid.dto.CaseDTO;
import com.teamthree.legalaid.dto.ScheduleDTO;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.service.lawyer.LawyerDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/lawyer/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('LAWYER')")
public class LawyerDashboardController {

    private final LawyerDashboardService lawyerDashboardService;

    @GetMapping("/overview")
    public ResponseEntity<LawyerDashboardDTO> getDashboardOverview(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(lawyerDashboardService.getDashboardOverview(user));
    }

    @GetMapping("/cases/assigned")
    public ResponseEntity<List<CaseDTO>> getAssignedCases(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(lawyerDashboardService.getAssignedCases(user));
    }

    @GetMapping("/cases/completed")
    public ResponseEntity<List<CaseDTO>> getCompletedCases(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(lawyerDashboardService.getCompletedCases(user));
    }

    @GetMapping("/cases/pending")
    public ResponseEntity<List<CaseDTO>> getPendingCases(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(lawyerDashboardService.getPendingCases(user));
    }

    @GetMapping("/schedule/today")
    public ResponseEntity<List<ScheduleDTO>> getTodaySchedule(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(lawyerDashboardService.getTodaySchedule(user));
    }

    @PutMapping("/availability")
    public ResponseEntity<?> updateAvailability(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Boolean> availability) {
        return ResponseEntity.ok(lawyerDashboardService.updateAvailability(
            user, availability.get("isAvailable")));
    }
}