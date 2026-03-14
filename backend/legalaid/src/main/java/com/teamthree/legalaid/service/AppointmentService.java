package com.teamthree.legalaid.service;

import com.teamthree.legalaid.dto.AppointmentDTO;
import com.teamthree.legalaid.dto.AppointmentRequest;
import com.teamthree.legalaid.dto.AppointmentUpdateRequest;
import com.teamthree.legalaid.entity.Appointment;
import com.teamthree.legalaid.entity.Match;
import com.teamthree.legalaid.entity.Notification;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.repository.AppointmentRepository;
import com.teamthree.legalaid.repository.MatchRepository;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

public class AppointmentService {
	
	private final AppointmentRepository appointmentRepository;
    private final MatchRepository matchRepository;
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
 
        // Notify the citizen
        notificationService.saveNotification(Notification.builder()
                .userId(user.getId())
                .message("Your appointment has been scheduled for " + request.getScheduledTime())
                .type("APPOINTMENT_CREATED")
                .read(false)
                .build());
 
        return mapToDTO(saved);
    }

	private AppointmentDTO mapToDTO(Appointment saved) {
		// TODO Auto-generated method stub
		return null;
	}

	public Object getMyAppointments(User user) {
		// TODO Auto-generated method stub
		return null;
	}

	public Object getAppointmentsByMatch(Long matchId) {
		// TODO Auto-generated method stub
		return null;
	}

	public Object getAppointmentsForNgo(Long profileId) {
		// TODO Auto-generated method stub
		return null;
	}

	public AppointmentDTO updateAppointment(User user, Long id, @Valid AppointmentUpdateRequest request) {
		// TODO Auto-generated method stub
		return null;
	}

}
