package com.teamthree.legalaid.service;

import com.teamthree.legalaid.dto.AppointmentDTO;
import com.teamthree.legalaid.dto.AppointmentRequest;
import com.teamthree.legalaid.dto.AppointmentUpdateRequest;
import com.teamthree.legalaid.entity.Appointment;
import com.teamthree.legalaid.entity.Match;
import com.teamthree.legalaid.entity.Notification;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.repository.AppointmentRepository;
import com.teamthree.legalaid.repository.LawyerRepository;
import com.teamthree.legalaid.repository.MatchRepository;
import com.teamthree.legalaid.repository.NgoProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final MatchRepository matchRepository;
    private final LawyerRepository lawyerRepository;
    private final NgoProfileRepository ngoProfileRepository;
    private final NotificationService notificationService;

    @Transactional
    public AppointmentDTO createAppointment(User user, AppointmentRequest request) {

        Match match = matchRepository.findById(request.getMatchId())
                .orElseThrow(() -> new RuntimeException("Match not found: " + request.getMatchId()));

        if (match.getCase() == null || !match.getCase().getClient().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorised to book an appointment on this match");
        }

        if (!"ACCEPTED".equals(match.getStatus())) {
            throw new RuntimeException("Appointments can only be scheduled for accepted matches");
        }

        Appointment appointment = Appointment.builder()
                .match(match)
                .user(user)
                .scheduledTime(request.getScheduledTime())
                .durationMinutes(request.getDurationMinutes())
                .notes(request.getNotes())
                .status("PENDING")
                .build();

        Appointment saved = appointmentRepository.save(appointment);

   
        notificationService.saveNotification(Notification.builder()
                .userId(user.getId())
                .message("Your appointment has been scheduled for " + request.getScheduledTime())
                .type("APPOINTMENT_CREATED")
                .read(false)
                .build());

        return mapToDTO(saved);
    }

    public List<AppointmentDTO> getMyAppointments(User user) {
        return appointmentRepository.findByUserOrderByScheduledTimeDesc(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAppointmentsByMatch(Long matchId) {
        return appointmentRepository.findByMatch_IdOrderByScheduledTimeDesc(matchId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

     public List<AppointmentDTO> getAppointmentsForLawyer(Long lawyerProfileId) {
        return appointmentRepository.findByLawyerProfileId(lawyerProfileId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAppointmentsForNgo(Long ngoProfileId) {
        return appointmentRepository.findByNgoProfileId(ngoProfileId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AppointmentDTO updateAppointment(User user, Long appointmentId, AppointmentUpdateRequest request) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found: " + appointmentId));

        if (!appointment.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorised to update this appointment");
        }

        if (request.getScheduledTime() != null) {
            appointment.setScheduledTime(request.getScheduledTime());
        }
        if (request.getDurationMinutes() != null) {
            appointment.setDurationMinutes(request.getDurationMinutes());
        }
        if (request.getNotes() != null) {
            appointment.setNotes(request.getNotes());
        }
        if (request.getStatus() != null) {
            validateStatusTransition(appointment.getStatus(), request.getStatus());
            appointment.setStatus(request.getStatus());
        }

        Appointment saved = appointmentRepository.save(appointment);

      
        if (request.getStatus() != null) {
            String msg = "CANCELLED".equals(request.getStatus())
                    ? "Your appointment has been cancelled."
                    : "Your appointment has been confirmed for " + saved.getScheduledTime();

            notificationService.saveNotification(Notification.builder()
                    .userId(user.getId())
                    .message(msg)
                    .type("APPOINTMENT_UPDATED")
                    .read(false)
                    .build());
        }

        return mapToDTO(saved);
    }

    private void validateStatusTransition(String current, String next) {
   
        if ("CANCELLED".equals(current)) {
            throw new RuntimeException("Cannot update a cancelled appointment");
        }

        if ("COMPLETED".equals(current)) {
            throw new RuntimeException("Cannot update a completed appointment");
        }
        
        if (!List.of("PENDING", "CONFIRMED", "CANCELLED").contains(next)) {
            throw new RuntimeException("Invalid status: " + next);
        }
    }

    private AppointmentDTO mapToDTO(Appointment a) {
        AppointmentDTO.AppointmentDTOBuilder builder = AppointmentDTO.builder()
                .id(a.getId())
                .matchId(a.getMatch() != null ? a.getMatch().getId() : null)
                .userId(a.getUser() != null ? a.getUser().getId() : null)
                .userName(a.getUser() != null ? a.getUser().getFullname() : null)
                .scheduledTime(a.getScheduledTime())
                .durationMinutes(a.getDurationMinutes())
                .notes(a.getNotes())
                .status(a.getStatus())
                .createdAt(a.getCreatedAt())
                .updatedAt(a.getUpdatedAt());

      
        if (a.getMatch() != null) {
            builder.profileType(a.getMatch().getProfileType());

            if ("LAWYER".equals(a.getMatch().getProfileType())) {
                lawyerRepository.findById(a.getMatch().getProfileId()).ifPresent(lawyer -> {
                    builder.profileName(lawyer.getUser() != null ? lawyer.getUser().getFullname() : "Unknown");
                    builder.profileExpertise(lawyer.getExpertise());
                });
            } else if ("NGO".equals(a.getMatch().getProfileType())) {
                ngoProfileRepository.findById(a.getMatch().getProfileId()).ifPresent(ngo -> {
                    builder.profileName(ngo.getOrganizationName());
                    builder.profileExpertise(ngo.getExpertise());
                });
            }
        }

        return builder.build();
    }
}