package com.teamthree.legalaid.controller;

import com.teamthree.legalaid.dto.AppointmentDTO;
import com.teamthree.legalaid.dto.AppointmentRequest;
import com.teamthree.legalaid.dto.AppointmentUpdateRequest;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.repository.LawyerRepository;
import com.teamthree.legalaid.repository.NgoProfileRepository;
import com.teamthree.legalaid.repository.UserRepository;
import com.teamthree.legalaid.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserRepository userRepository;
    private final LawyerRepository lawyerRepository;
    private final NgoProfileRepository ngoProfileRepository;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createAppointment(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody AppointmentRequest request) {

        User user = resolveUser(principal);
        AppointmentDTO dto = appointmentService.createAppointment(user, request);
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Appointment scheduled successfully",
                "appointment", dto
        ));
    }


    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<AppointmentDTO>> getMyAppointments(
            @AuthenticationPrincipal UserDetails principal) {

        User user = resolveUser(principal);
        return ResponseEntity.ok(appointmentService.getMyAppointments(user));
    }


    @GetMapping("/match/{matchId}")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByMatch(
            @PathVariable Long matchId) {

        return ResponseEntity.ok(appointmentService.getAppointmentsByMatch(matchId));
    }


    @GetMapping("/lawyer")
    @PreAuthorize("hasRole('LAWYER')")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsForLawyer(
            @AuthenticationPrincipal UserDetails principal) {

        User user = resolveUser(principal);
        Long profileId = lawyerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Lawyer profile not found for user: " + user.getEmail()))
                .getId();
        return ResponseEntity.ok(appointmentService.getAppointmentsForLawyer(profileId));
    }

    @GetMapping("/ngo")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsForNgo(
            @AuthenticationPrincipal UserDetails principal) {

        User user = resolveUser(principal);
        Long profileId = ngoProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("NGO profile not found for user: " + user.getEmail()))
                .getId();
        return ResponseEntity.ok(appointmentService.getAppointmentsForNgo(profileId));
    }

 
    @PutMapping("/{id}/update")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateAppointment(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long id,
            @Valid @RequestBody AppointmentUpdateRequest request) {

        User user = resolveUser(principal);
        AppointmentDTO dto = appointmentService.updateAppointment(user, id, request);
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Appointment updated successfully",
                "appointment", dto
        ));
    }

    private User resolveUser(UserDetails principal) {
        return userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + principal.getUsername()));
    }
}