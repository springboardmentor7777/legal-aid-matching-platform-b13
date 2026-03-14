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

import jakarta.validation.Valid;
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

	 public AppointmentDTO updateAppointment(User user, Long id, @Valid AppointmentUpdateRequest request) {
		// TODO Auto-generated method stub
		return null;
	 }
   
}