package com.legalmatch.backend.controller;

import com.legalmatch.backend.dto.CreateAppointmentRequest;
import com.legalmatch.backend.dto.UpdateAppointmentRequest;
import com.legalmatch.backend.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @PostMapping
    public ResponseEntity<?> createAppointment(
            @RequestBody CreateAppointmentRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(
                scheduleService.createAppointment(request, authentication.getName())
        );
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyAppointments(Authentication authentication) {
        return ResponseEntity.ok(
                scheduleService.getMyAppointments(authentication.getName())
        );
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<?> updateAppointment(
            @PathVariable Long id,
            @RequestBody UpdateAppointmentRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(
                scheduleService.updateAppointment(id, request, authentication.getName())
        );
    }
}
