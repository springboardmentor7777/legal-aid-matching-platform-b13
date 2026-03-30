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

        // FIX: was match.getCase() — correct method is getCaseEntity()
        if (match.getCaseEntity() == null
                || match.getCaseEntity().getClient() == null
                || !match.getCaseEntity().getClient().getId().equals(user.getId())) {
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

        // Notify citizen
        notificationService.saveNotification(Notification.builder()
                .userId(user.getId())
                .message("Appointment scheduled for " + request.getScheduledTime())
                .type("APPOINTMENT_CREATED").read(false).build());

        // Notify lawyer/NGO
        Long profileUserId = resolveProfileUserId(match);
        if (profileUserId != null)
            notificationService.saveNotification(Notification.builder()
                    .userId(profileUserId)
                    .message(user.getFullname() + " scheduled an appointment for " + request.getScheduledTime())
                    .type("APPOINTMENT_CREATED").read(false).build());

        return mapToDTO(saved);
    }

    public List<AppointmentDTO> getMyAppointments(User user) {
        return appointmentRepository.findByUserOrderByScheduledTimeDesc(user)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAppointmentsByMatch(Long matchId) {
        return appointmentRepository.findByMatch_IdOrderByScheduledTimeDesc(matchId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAppointmentsForLawyer(Long lawyerProfileId) {
        return appointmentRepository.findByLawyerProfileId(lawyerProfileId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAppointmentsForNgo(Long ngoProfileId) {
        return appointmentRepository.findByNgoProfileId(ngoProfileId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Transactional
    public AppointmentDTO updateAppointment(User user, Long appointmentId, AppointmentUpdateRequest request) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found: " + appointmentId));

        if (!appointment.getUser().getId().equals(user.getId()))
            throw new RuntimeException("You are not authorised to update this appointment");

        if (request.getScheduledTime() != null) appointment.setScheduledTime(request.getScheduledTime());
        if (request.getDurationMinutes() != null) appointment.setDurationMinutes(request.getDurationMinutes());
        if (request.getNotes() != null) appointment.setNotes(request.getNotes());
        if (request.getStatus() != null) {
            validateStatusTransition(appointment.getStatus(), request.getStatus());
            appointment.setStatus(request.getStatus());
        }

        Appointment saved = appointmentRepository.save(appointment);

        if (request.getStatus() != null) {
            String msg = "CANCELLED".equals(request.getStatus())
                    ? "Your appointment has been cancelled."
                    : "Your appointment is confirmed for " + saved.getScheduledTime();
            notificationService.saveNotification(Notification.builder()
                    .userId(user.getId()).message(msg).type("APPOINTMENT_UPDATED").read(false).build());
        }

        return mapToDTO(saved);
    }

    private void validateStatusTransition(String current, String next) {
        if ("CANCELLED".equals(current)) throw new RuntimeException("Cannot update a cancelled appointment");
        if ("COMPLETED".equals(current)) throw new RuntimeException("Cannot update a completed appointment");
        if (!List.of("PENDING", "CONFIRMED", "CANCELLED").contains(next))
            throw new RuntimeException("Invalid status: " + next);
    }

    private Long resolveProfileUserId(Match match) {
        if ("LAWYER".equals(match.getProfileType()))
            return lawyerRepository.findById(match.getProfileId())
                    .map(lp -> lp.getUser() != null ? lp.getUser().getId() : null).orElse(null);
        if ("NGO".equals(match.getProfileType()))
            return ngoProfileRepository.findById(match.getProfileId())
                    .map(np -> np.getUser() != null ? np.getUser().getId() : null).orElse(null);
        return null;
    }

    private AppointmentDTO mapToDTO(Appointment a) {
        AppointmentDTO.AppointmentDTOBuilder b = AppointmentDTO.builder()
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
            b.profileType(a.getMatch().getProfileType());
            if ("LAWYER".equals(a.getMatch().getProfileType()))
                lawyerRepository.findById(a.getMatch().getProfileId()).ifPresent(l -> {
                    b.profileName(l.getUser() != null ? l.getUser().getFullname() : "Unknown");
                    b.profileExpertise(l.getExpertise());
                });
            else if ("NGO".equals(a.getMatch().getProfileType()))
                ngoProfileRepository.findById(a.getMatch().getProfileId()).ifPresent(n -> {
                    b.profileName(n.getOrganizationName());
                    b.profileExpertise(n.getExpertise());
                });
        }
        return b.build();
    }
}