package com.legalmatch.backend.service;

import com.legalmatch.backend.dto.AppointmentResponse;
import com.legalmatch.backend.dto.CreateAppointmentRequest;
import com.legalmatch.backend.dto.UpdateAppointmentRequest;
import com.legalmatch.backend.entity.*;
import com.legalmatch.backend.repository.AppointmentRepository;
import com.legalmatch.backend.repository.MatchRepository;
import com.legalmatch.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final AppointmentRepository appointmentRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public AppointmentResponse createAppointment(CreateAppointmentRequest request, String username) {
        User creator = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        MatchEntity match = matchRepository.findById(request.getMatchId())
                .orElseThrow(() -> new RuntimeException("Match not found"));

        // Verify user is a participant
        if (!match.getCitizen().getId().equals(creator.getId()) &&
            !match.getProvider().getId().equals(creator.getId())) {
            throw new RuntimeException("You are not a participant in this match");
        }

        AppointmentEntity appointment = AppointmentEntity.builder()
                .match(match)
                .createdBy(creator)
                .title(request.getTitle())
                .description(request.getDescription())
                .appointmentDate(request.getAppointmentDate())
                .location(request.getLocation())
                .status(AppointmentStatus.SCHEDULED)
                .build();

        AppointmentEntity saved = appointmentRepository.save(appointment);

        // Notify the other party
        User otherParty = match.getCitizen().getId().equals(creator.getId())
                ? match.getProvider() : match.getCitizen();

        notificationService.createNotification(
                otherParty,
                "New Appointment",
                creator.getUsername() + " scheduled an appointment: " + request.getTitle(),
                "APPOINTMENT"
        );

        return mapToResponse(saved);
    }

    public List<AppointmentResponse> getMyAppointments(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<AppointmentEntity> appointments = appointmentRepository.findByParticipant(user);

        return appointments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AppointmentResponse updateAppointment(Long appointmentId, UpdateAppointmentRequest request, String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AppointmentEntity appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Verify user is a participant in the match
        MatchEntity match = appointment.getMatch();
        if (!match.getCitizen().getId().equals(user.getId()) &&
            !match.getProvider().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to update this appointment");
        }

        if (request.getTitle() != null) {
            appointment.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            appointment.setDescription(request.getDescription());
        }
        if (request.getAppointmentDate() != null) {
            appointment.setAppointmentDate(request.getAppointmentDate());
        }
        if (request.getLocation() != null) {
            appointment.setLocation(request.getLocation());
        }
        if (request.getStatus() != null) {
            appointment.setStatus(AppointmentStatus.valueOf(request.getStatus()));
        }

        AppointmentEntity saved = appointmentRepository.save(appointment);

        return mapToResponse(saved);
    }

    private AppointmentResponse mapToResponse(AppointmentEntity a) {
        return AppointmentResponse.builder()
                .id(a.getId())
                .matchId(a.getMatch().getId())
                .title(a.getTitle())
                .description(a.getDescription())
                .appointmentDate(a.getAppointmentDate())
                .location(a.getLocation())
                .status(a.getStatus().name())
                .createdById(a.getCreatedBy().getId())
                .createdByName(a.getCreatedBy().getUsername())
                .citizenName(a.getMatch().getCitizen().getUsername())
                .providerName(a.getMatch().getProvider().getUsername())
                .createdAt(a.getCreatedAt())
                .updatedAt(a.getUpdatedAt())
                .build();
    }
}
