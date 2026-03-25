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

    // ─────────────────────────────────────────────────────────────────────────────
    // CHANGED: bookAppointment
    //
    // BEFORE: Always set status = "SCHEDULED" regardless of who booked.
    //         Sent the same two notifications every time.
    //
    // AFTER:  Detects whether the booker is the citizen or the provider.
    //         • Citizen books  → status = "PENDING_CONFIRMATION"
    //                          → notifies citizen ("request sent")
    //                          → notifies provider ("action required")
    //         • Provider books → status = "CONFIRMED" (auto-confirmed)
    //                          → notifies citizen ("appointment confirmed")
    //         Response message is also tailored to the booking party.
    // ─────────────────────────────────────────────────────────────────────────────
    public AppointmentResponseDto bookAppointment(User currentUser, AppointmentRequestDto request) {

        Match match = matchRepository.findById(request.getMatchId())
                .orElseThrow(() -> new RuntimeException("Match not found"));

        Case caseObj = caseRepository.findById(match.getCaseId())
                .orElseThrow(() -> new RuntimeException("Case not found"));

        Long citizenId = caseObj.getUser().getId();
        Long providerId = match.getUserId();

        // UNCHANGED: Both citizen and provider are allowed to book
        if (!citizenId.equals(currentUser.getId()) && !providerId.equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized: This match does not belong to your case.");
        }

        // UNCHANGED: Match must be ACCEPTED before an appointment can be booked
        if (!"ACCEPTED".equalsIgnoreCase(match.getStatus().name())) {
            throw new RuntimeException("Cannot book appointment: The provider has not accepted this match yet.");
        }

        User actualCitizen = caseObj.getUser();
        User actualProvider = userRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        // CHANGED: Determine the booker so we can branch status and notifications
        boolean bookedByCitizen = citizenId.equals(currentUser.getId());

        // UNCHANGED: Build the Schedule entity from the request
        Schedule schedule = new Schedule();
        schedule.setMatch(match);
        schedule.setAppointmentDate(request.getAppointmentDate());
        schedule.setAppointmentTime(request.getAppointmentTime());
        schedule.setNotes(request.getNotes());
        schedule.setCallDuration(request.getCallDuration());
        schedule.setZone(request.getZone());
        schedule.setReminder(request.getReminder());
        schedule.setSelectedTime(request.getSelectedTime());
        schedule.setScheduledTime(LocalDateTime.now());

        // CHANGED: Status is no longer always "SCHEDULED"
        if (bookedByCitizen) {
            // Citizen-initiated booking must wait for provider to confirm
            schedule.setStatus("PENDING_CONFIRMATION");
        } else {
            // Provider-initiated booking is immediately confirmed
            schedule.setStatus("CONFIRMED");
        }

        schedule = scheduleRepository.save(schedule);

        // CHANGED: Notifications are now split based on who booked
        if (bookedByCitizen) {
            // Notify citizen that their request was submitted
            notificationService.createNotification(
                    actualCitizen,
                    "Appointment Request Sent",
                    "Your appointment request for " + request.getAppointmentDate() + " at " + request.getAppointmentTime()
                            + " has been sent to " + actualProvider.getUsername() + ". Awaiting confirmation.",
                    "APPOINTMENT",
                    schedule.getId()
            );

            // Notify provider that action is required
            notificationService.createNotification(
                    actualProvider,
                    "New Appointment Request",
                    "A citizen has requested an appointment for Case: " + caseObj.getTitle()
                            + " on " + request.getAppointmentDate() + " at " + request.getAppointmentTime()
                            + ". Please confirm or decline from your dashboard.",
                    "APPOINTMENT",
                    schedule.getId()
            );
        } else {
            // Provider booked directly — citizen just gets a confirmation notice
            notificationService.createNotification(
                    actualCitizen,
                    "Appointment Confirmed",
                    "An appointment has been scheduled for Case: " + caseObj.getTitle()
                            + " on " + request.getAppointmentDate() + " at " + request.getAppointmentTime(),
                    "APPOINTMENT",
                    schedule.getId()
            );
        }

        // CHANGED: Response message reflects the actual status
        return new AppointmentResponseDto(
                schedule.getId(), match.getId(), schedule.getStatus(),
                bookedByCitizen
                        ? "Appointment request sent. Awaiting provider confirmation."
                        : "Appointment confirmed.",
                schedule.getAppointmentDate(), schedule.getAppointmentTime(),
                schedule.getNotes(), schedule.getCallDuration(),
                schedule.getZone(), schedule.getSelectedTime()
        );
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // NEW METHOD: confirmAppointment
    //
    // Called via: PATCH /appointments/{id}/confirm
    // Who can call: Provider (Lawyer/NGO) only.
    //
    // Transitions status: PENDING_CONFIRMATION → CONFIRMED
    // Notifies the citizen that their request was accepted.
    // ─────────────────────────────────────────────────────────────────────────────
    public AppointmentResponseDto confirmAppointment(Long id, User currentUser) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        Case caseObj = caseRepository.findById(schedule.getMatch().getCaseId())
                .orElseThrow(() -> new RuntimeException("Case not found"));

        Long providerId = schedule.getMatch().getUserId();

        // Only the assigned provider may confirm
        if (!providerId.equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized: Only the assigned provider can confirm this appointment.");
        }

        // Guard: must still be in pending state
        if (!"PENDING_CONFIRMATION".equalsIgnoreCase(schedule.getStatus())) {
            throw new RuntimeException("Appointment is not pending confirmation.");
        }

        schedule.setStatus("CONFIRMED");
        schedule = scheduleRepository.save(schedule);

        // Notify the citizen that the provider accepted
        notificationService.createNotification(
                caseObj.getUser(),
                "Appointment Confirmed",
                "Your appointment on " + schedule.getAppointmentDate() + " at " + schedule.getAppointmentTime()
                        + " has been confirmed by the provider.",
                "APPOINTMENT",
                schedule.getId()
        );

        return mapToDto(schedule);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // NEW METHOD: cancelAppointmentWithReason
    //
    // Called via: PATCH /appointments/{id}/cancel
    // Who can call: Provider (Lawyer/NGO) only.
    // Request body: { "reason": "..." }
    //
    // Transitions status: PENDING_CONFIRMATION → CANCELLED
    // Appends reason to notes field for audit trail.
    // Notifies the citizen with the specific decline reason.
    // ─────────────────────────────────────────────────────────────────────────────
    public AppointmentResponseDto cancelAppointmentWithReason(Long id, String reason, User currentUser) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        Case caseObj = caseRepository.findById(schedule.getMatch().getCaseId())
                .orElseThrow(() -> new RuntimeException("Case not found"));

        Long providerId = schedule.getMatch().getUserId();

        // Only the assigned provider may decline a pending appointment
        if (!providerId.equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized: Only the assigned provider can decline this appointment.");
        }

        // Guard: only PENDING_CONFIRMATION appointments can be declined this way
        if (!"PENDING_CONFIRMATION".equalsIgnoreCase(schedule.getStatus())) {
            throw new RuntimeException("Only pending appointments can be declined this way.");
        }

        schedule.setStatus("CANCELLED");

        // Append reason to notes for audit trail (preserves original notes if any)
        schedule.setNotes(
                (schedule.getNotes() != null ? schedule.getNotes() + " | " : "")
                + "Declined by provider. Reason: " + reason
        );
        schedule = scheduleRepository.save(schedule);

        // Notify the citizen with the specific reason for decline
        notificationService.createNotification(
                caseObj.getUser(),
                "Appointment Declined",
                "Your appointment request for " + schedule.getAppointmentDate() + " at " + schedule.getAppointmentTime()
                        + " was declined. Reason: " + reason,
                "APPOINTMENT",
                schedule.getId()
        );

        return mapToDto(schedule);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // UNCHANGED: getAllAppointments
    // ─────────────────────────────────────────────────────────────────────────────
    public List<AppointmentResponseDto> getAllAppointments(User currentUser) {
        List<Schedule> schedules = scheduleRepository.findAllUserAppointments(currentUser.getId());
        return schedules.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // UNCHANGED: getAppointmentById
    // ─────────────────────────────────────────────────────────────────────────────
    public AppointmentResponseDto getAppointmentById(Long id, User currentUser) {
        Schedule schedule = getScheduleAndVerifyOwnership(id, currentUser);
        return mapToDto(schedule);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // UNCHANGED: updateAppointment
    // ─────────────────────────────────────────────────────────────────────────────
    public AppointmentResponseDto updateAppointment(Long id, AppointmentRequestDto request, User currentUser) {
        Schedule schedule = getScheduleAndVerifyOwnership(id, currentUser);

        if (request.getAppointmentDate() != null) schedule.setAppointmentDate(request.getAppointmentDate());
        if (request.getAppointmentTime() != null) schedule.setAppointmentTime(request.getAppointmentTime());
        if (request.getNotes() != null) schedule.setNotes(request.getNotes());

        schedule = scheduleRepository.save(schedule);
        return mapToDto(schedule);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // UNCHANGED: deleteAppointment
    // ─────────────────────────────────────────────────────────────────────────────
    public void deleteAppointment(Long id, User currentUser) {
        Schedule schedule = getScheduleAndVerifyOwnership(id, currentUser);
        schedule.setStatus("CANCELLED");
        scheduleRepository.save(schedule);

        Case caseObj = caseRepository.findById(schedule.getMatch().getCaseId()).orElseThrow();
        User provider = userRepository.findById(schedule.getMatch().getUserId()).orElseThrow();

        User otherUser = caseObj.getUser().getId().equals(currentUser.getId()) ? provider : caseObj.getUser();

        notificationService.createNotification(
                otherUser,
                "Appointment Cancelled",
                "An appointment for Case: " + caseObj.getTitle() + " has been cancelled.",
                "APPOINTMENT",
                schedule.getId()
        );
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // UNCHANGED: getScheduleAndVerifyOwnership
    // ─────────────────────────────────────────────────────────────────────────────
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

    // ─────────────────────────────────────────────────────────────────────────────
    // UNCHANGED: mapToDto
    // ─────────────────────────────────────────────────────────────────────────────
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
