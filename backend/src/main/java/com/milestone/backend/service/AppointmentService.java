package com.milestone.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.milestone.backend.dto.AppointmentRequestDto;
import com.milestone.backend.dto.AppointmentResponseDto;
import com.milestone.backend.entity.*;
import com.milestone.backend.repository.ScheduleRepository;
import com.milestone.backend.repository.MatchRepository;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final MatchRepository matchRepository;
    private final ScheduleRepository scheduleRepository;
    private final NotificationService notificationService;

    public AppointmentResponseDto bookAppointment(User citizen, AppointmentRequestDto request) {

        // 1. Validate Match Existence
        Match match = matchRepository.findById(request.getMatchId())
                .orElseThrow(() -> new RuntimeException("Match not found"));

        // 2. Validate Ownership
        if (!match.getLegalCase().getUser().getId().equals(citizen.getId())) {
            throw new RuntimeException("Unauthorized: This match does not belong to your case.");
        }

        // 3. Validate Status
        if (!"ACCEPTED".equalsIgnoreCase(match.getStatus())) {
            throw new RuntimeException("Cannot book appointment: The provider has not accepted this match yet.");
        }

        // 4. Create Schedule (Appointment)
        Schedule schedule = new Schedule();
        schedule.setMatch(match);
        schedule.setAppointmentDate(request.getAppointmentDate());
        schedule.setAppointmentTime(request.getAppointmentTime());
        schedule.setNotes(request.getNotes());
        schedule.setStatus("SCHEDULED");

        schedule = scheduleRepository.save(schedule);

        // 5. Send Notification to Citizen
        notificationService.createNotification(
                citizen,
                "Appointment Confirmed",
                "You have successfully booked an appointment for " + request.getAppointmentDate() + " at "
                        + request.getAppointmentTime(),
                "APPOINTMENT",
                schedule.getId()

        );

        // 6. Send Notification to Provider (Lawyer/NGO)
        notificationService.createNotification(
                match.getMatchedProvider(),
                "New Appointment Request",
                "A new appointment has been scheduled for Case: " + match.getLegalCase().getTitle() + " on "
                        + request.getAppointmentDate(),
                "APPOINTMENT",
                schedule.getId());

        return new AppointmentResponseDto(
                schedule.getId(),
                match.getId(),
                "SCHEDULED",
                "Appointment successfully booked and notifications sent.");
    }

    public List<AppointmentResponseDto> getAllAppointments(User currentUser) {
        // Fetch appointments where the user is either the case creator or the matched provider
        List<Schedule> schedules = scheduleRepository.findByMatch_LegalCase_User_IdOrMatch_MatchedProvider_Id(
                currentUser.getId(), currentUser.getId());

        return schedules.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // --- NEW GET BY ID METHOD ---
    public AppointmentResponseDto getAppointmentById(Long id, User currentUser) {
        Schedule schedule = getScheduleAndVerifyOwnership(id, currentUser);
        return mapToDto(schedule);
    }

    // --- NEW PUT METHOD ---
    public AppointmentResponseDto updateAppointment(Long id, AppointmentRequestDto request, User currentUser) {
        Schedule schedule = getScheduleAndVerifyOwnership(id, currentUser);

        // Update fields if they are provided
        if (request.getAppointmentDate() != null) schedule.setAppointmentDate(request.getAppointmentDate());
        if (request.getAppointmentTime() != null) schedule.setAppointmentTime(request.getAppointmentTime());
        if (request.getNotes() != null) schedule.setNotes(request.getNotes());

        schedule = scheduleRepository.save(schedule);

        return mapToDto(schedule);
    }

    // --- NEW DELETE METHOD ---
    public void deleteAppointment(Long id, User currentUser) {
        Schedule schedule = getScheduleAndVerifyOwnership(id, currentUser);
        
        // Soft delete: Change status to CANCELLED instead of wiping it from DB
        schedule.setStatus("CANCELLED");
        scheduleRepository.save(schedule);
        
        // Figure out who the "other person" is to notify them of the cancellation
        User otherUser = schedule.getMatch().getLegalCase().getUser().getId().equals(currentUser.getId()) 
                            ? schedule.getMatch().getMatchedProvider() 
                            : schedule.getMatch().getLegalCase().getUser();

        notificationService.createNotification(
            otherUser,
            "Appointment Cancelled",
            "An appointment for Case: " + schedule.getMatch().getLegalCase().getTitle() + " has been cancelled.",
            "APPOINTMENT",
            schedule.getId()
        );
    }

    //--- HELPER METHODS ---
    private Schedule getScheduleAndVerifyOwnership(Long id, User currentUser) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        Long citizenId = schedule.getMatch().getLegalCase().getUser().getId();
        Long providerId = schedule.getMatch().getMatchedProvider().getId();

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
                schedule.getNotes()
        );
    }

}