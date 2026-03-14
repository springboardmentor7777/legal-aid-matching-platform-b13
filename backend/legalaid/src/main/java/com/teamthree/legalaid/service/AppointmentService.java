package com.teamthree.legalaid.service;

import com.teamthree.legalaid.dto.AppointmentDTO;
import com.teamthree.legalaid.dto.AppointmentRequest;
import com.teamthree.legalaid.dto.AppointmentUpdateRequest;
import com.teamthree.legalaid.entity.User;

import jakarta.validation.Valid;

public class AppointmentService {

	public AppointmentDTO createAppointment(User user, @Valid AppointmentRequest request) {
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

	public Object getAppointmentsForLawyer(Long profileId) {
		// TODO Auto-generated method stub
		return null;
	}

}
