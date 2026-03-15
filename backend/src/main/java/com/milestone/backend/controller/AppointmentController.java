// package com.milestone.backend.controller;

// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.annotation.AuthenticationPrincipal;
// import org.springframework.web.bind.annotation.*;
// import lombok.RequiredArgsConstructor;
// import com.milestone.backend.dto.AppointmentRequestDto;
// import com.milestone.backend.dto.AppointmentResponseDto;
// import com.milestone.backend.service.AppointmentService;
// import com.milestone.backend.entity.User;
// import java.util.List;

// @RestController
// @RequestMapping("/appointments")
// @RequiredArgsConstructor
// public class AppointmentController {

//     private final AppointmentService appointmentService;

//     // Create a new appointment
//     @PostMapping
//     public ResponseEntity<AppointmentResponseDto> createAppointment(
//             @AuthenticationPrincipal User currentUser,
//             @RequestBody AppointmentRequestDto requestDto
//     ) {
//         var response = appointmentService.bookAppointment(currentUser, requestDto);
//         return ResponseEntity.ok(response);
//     }

//     // Get all appointments for the logged-in user
//     @GetMapping("/my")
//     public ResponseEntity<List<AppointmentResponseDto>> getAllAppointments(
//             @AuthenticationPrincipal User currentUser
//     ) {
//         return ResponseEntity.ok(appointmentService.getAllAppointments(currentUser));
//     }

//     // Get a specific appointment by ID
//     @GetMapping("/{id}")
//     public ResponseEntity<AppointmentResponseDto> getAppointmentById(
//             @PathVariable Long id,
//             @AuthenticationPrincipal User currentUser
//     ) {
//         return ResponseEntity.ok(appointmentService.getAppointmentById(id, currentUser));
//     }

//     // Update an appointment (e.g. Reschedule)
//     @PutMapping("/{id}")
//     public ResponseEntity<AppointmentResponseDto> updateAppointment(
//             @PathVariable Long id,
//             @RequestBody AppointmentRequestDto requestDto,
//             @AuthenticationPrincipal User currentUser
//     ) {
//         return ResponseEntity.ok(appointmentService.updateAppointment(id, requestDto, currentUser));
//     }

//     // Cancel an appointment
//     @DeleteMapping("/{id}")
//     public ResponseEntity<String> deleteAppointment(
//             @PathVariable Long id,
//             @AuthenticationPrincipal User currentUser
//     ) {
//         appointmentService.deleteAppointment(id, currentUser);
//         return ResponseEntity.ok("Appointment successfully cancelled.");
//     }
// }