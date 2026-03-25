package com.milestone.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import com.milestone.backend.dto.AppointmentRequestDto;
import com.milestone.backend.dto.AppointmentResponseDto;
import com.milestone.backend.service.AppointmentService;
import com.milestone.backend.entity.User;
import java.util.List;
import java.util.Map; // CHANGED: Added import for Map (used in cancel endpoint request body)

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    // ─────────────────────────────────────────────────────────────────────────────
    // UNCHANGED: POST /appointments
    // Creates a new appointment.
    // Status will now be PENDING_CONFIRMATION (citizen) or CONFIRMED (provider)
    // depending on who calls it — that logic lives in the service.
    // ─────────────────────────────────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<AppointmentResponseDto> createAppointment(
            @AuthenticationPrincipal User currentUser,
            @RequestBody AppointmentRequestDto requestDto
    ) {
        var response = appointmentService.bookAppointment(currentUser, requestDto);
        return ResponseEntity.ok(response);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // UNCHANGED: GET /appointments/my
    // Returns all appointments for the logged-in user (citizen or provider).
    // ─────────────────────────────────────────────────────────────────────────────
    @GetMapping("/my")
    public ResponseEntity<List<AppointmentResponseDto>> getAllAppointments(
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(appointmentService.getAllAppointments(currentUser));
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // UNCHANGED: GET /appointments/{id}
    // Returns a specific appointment by ID (ownership verified in service).
    // ─────────────────────────────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponseDto> getAppointmentById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id, currentUser));
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // UNCHANGED: PUT /appointments/{id}
    // Reschedules an existing appointment (date, time, notes).
    // ─────────────────────────────────────────────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<AppointmentResponseDto> updateAppointment(
            @PathVariable Long id,
            @RequestBody AppointmentRequestDto requestDto,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(appointmentService.updateAppointment(id, requestDto, currentUser));
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // UNCHANGED: DELETE /appointments/{id}
    // Soft-deletes (cancels) an appointment. Notifies the other party.
    // ─────────────────────────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAppointment(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        appointmentService.deleteAppointment(id, currentUser);
        return ResponseEntity.ok("Appointment successfully cancelled.");
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // NEW ENDPOINT: PATCH /appointments/{id}/confirm
    //
    // Called by the Lawyer/NGO to accept a citizen's appointment request.
    // Transitions status: PENDING_CONFIRMATION → CONFIRMED
    // Notifies the citizen.
    // ─────────────────────────────────────────────────────────────────────────────
    @PatchMapping("/{id}/confirm")
    public ResponseEntity<AppointmentResponseDto> confirmAppointment(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(appointmentService.confirmAppointment(id, currentUser));
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // NEW ENDPOINT: PATCH /appointments/{id}/cancel
    //
    // Called by the Lawyer/NGO to decline a citizen's appointment request.
    // Request body: { "reason": "I am unavailable on this date." }
    // Transitions status: PENDING_CONFIRMATION → CANCELLED
    // Appends reason to notes. Notifies the citizen with the reason.
    // ─────────────────────────────────────────────────────────────────────────────
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<AppointmentResponseDto> cancelAppointmentWithReason(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User currentUser
    ) {
        String reason = body.getOrDefault("reason", "No reason provided.");
        return ResponseEntity.ok(appointmentService.cancelAppointmentWithReason(id, reason, currentUser));
    }
}
