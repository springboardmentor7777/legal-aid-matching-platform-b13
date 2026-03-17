package com.milestone.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.milestone.backend.dto.AppointmentRequestDto;
import com.milestone.backend.dto.AppointmentResponseDto;
import com.milestone.backend.entity.*;
import com.milestone.backend.repository.ScheduleRepository;
import com.milestone.backend.repository.MatchRepository;
import com.milestone.backend.repository.CaseRepository;
import com.milestone.backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final MatchRepository matchRepository;
    private final ScheduleRepository scheduleRepository;
    private final CaseRepository caseRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public AppointmentResponseDto bookAppointment(User citizen, AppointmentRequestDto request) {

        Match match = matchRepository.findById(request.getMatchId())
                .orElseThrow(() -> new RuntimeException("Match not found"));

        Case caseObj = caseRepository.findById(match.getCaseId())
                .orElseThrow(() -> new RuntimeException("Case not found"));

        if (!caseObj.getUser().getId().equals(citizen.getId())) {
            throw new RuntimeException("Unauthorized: This match does not belong to your case.");
        }

        if (!"ACCEPTED".equalsIgnoreCase(match.getStatus().name())) {
            throw new RuntimeException("Cannot book appointment: The provider has not accepted this match yet.");
        }

        User provider = userRepository.findById(match.getUserId())
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        Schedule schedule = new Schedule();
        schedule.setMatch(match);
        schedule.setAppointmentDate(request.getAppointmentDate());
        schedule.setAppointmentTime(request.getAppointmentTime());
        schedule.setNotes(request.getNotes());
        schedule.setCallDuration(request.getCallDuration());
        schedule.setZone(request.getZone());
        schedule.setReminder(request.getReminder());
        schedule.setSelectedTime(request.getSelectedTime());
        schedule.setStatus("SCHEDULED");
        schedule.setScheduledTime(LocalDateTime.now()); 

        // Must save the schedule first so we have an ID for the referenceId in notifications
        schedule = scheduleRepository.save(schedule);

        // FIXED: Using 5 arguments matching NotificationService.java
        notificationService.createNotification(
                citizen,
                "Appointment Confirmed",
                "You have successfully booked an appointment for " + request.getAppointmentDate() + " at " + request.getAppointmentTime(),
                "APPOINTMENT",
                schedule.getId()
        );

        // FIXED: Using 5 arguments matching NotificationService.java
        notificationService.createNotification(
                provider,
                "New Appointment Request",
                "A new appointment has been scheduled for Case: " + caseObj.getTitle() + " on " + request.getAppointmentDate(),
                "APPOINTMENT",
                schedule.getId()
        );

        return new AppointmentResponseDto(
                schedule.getId(), match.getId(), "SCHEDULED", "Appointment successfully booked and notifications sent.",
                schedule.getAppointmentDate(), schedule.getAppointmentTime(), schedule.getNotes(), schedule.getCallDuration(), schedule.getZone(), schedule.getSelectedTime()
        );
    }

    public List<AppointmentResponseDto> getAllAppointments(User currentUser) {
        List<Schedule> schedules = scheduleRepository.findAllUserAppointments(currentUser.getId());

        return schedules.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public AppointmentResponseDto getAppointmentById(Long id, User currentUser) {
        Schedule schedule = getScheduleAndVerifyOwnership(id, currentUser);
        return mapToDto(schedule);
    }

    public AppointmentResponseDto updateAppointment(Long id, AppointmentRequestDto request, User currentUser) {
        Schedule schedule = getScheduleAndVerifyOwnership(id, currentUser);

        if (request.getAppointmentDate() != null) schedule.setAppointmentDate(request.getAppointmentDate());
        if (request.getAppointmentTime() != null) schedule.setAppointmentTime(request.getAppointmentTime());
        if (request.getNotes() != null) schedule.setNotes(request.getNotes());

        schedule = scheduleRepository.save(schedule);
        return mapToDto(schedule);
    }

    public void deleteAppointment(Long id, User currentUser) {
        Schedule schedule = getScheduleAndVerifyOwnership(id, currentUser);
        schedule.setStatus("CANCELLED");
        scheduleRepository.save(schedule);
        
        Case caseObj = caseRepository.findById(schedule.getMatch().getCaseId()).orElseThrow();
        User provider = userRepository.findById(schedule.getMatch().getUserId()).orElseThrow();
        
        User otherUser = caseObj.getUser().getId().equals(currentUser.getId()) ? provider : caseObj.getUser();

        // FIXED: Using 5 arguments matching NotificationService.java
        notificationService.createNotification(
            otherUser,
            "Appointment Cancelled",
            "An appointment for Case: " + caseObj.getTitle() + " has been cancelled.",
            "APPOINTMENT",
            schedule.getId()
        );
    }

    // --- HELPER METHODS ---
    private Schedule getScheduleAndVerifyOwnership(Long id, User currentUser) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        Case caseObj = caseRepository.findById(schedule.getMatch().getCaseId())
                .orElseThrow(() -> new RuntimeException("Case not found"));

        Long citizenId = caseObj.getUser().getId();
        Long providerId = schedule.getMatch().getUserId();

        if (!citizenId.equals(currentUser.getId()) && !providerId.equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized: You do not have access to this appointment.");
        }

        return schedule;
    }

    private AppointmentResponseDto mapToDto(Schedule schedule) {
        return new AppointmentResponseDto(
                schedule.getId(),
                schedule.getMatch().getId(),
                schedule.getStatus(),
                "Success",
                schedule.getAppointmentDate(),
                schedule.getAppointmentTime(),
                schedule.getNotes(),
                schedule.getCallDuration(),
                schedule.getZone(),
                schedule.getSelectedTime()
        );
    }
}