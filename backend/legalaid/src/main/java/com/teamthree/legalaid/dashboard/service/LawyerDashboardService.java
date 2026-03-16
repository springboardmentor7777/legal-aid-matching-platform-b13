package com.teamthree.legalaid.dashboard.service;

import com.teamthree.legalaid.dashboard.dto.LawyerDashboardDTO;
import com.teamthree.legalaid.dto.CaseDTO;
import com.teamthree.legalaid.dto.ScheduleDTO;
import com.teamthree.legalaid.entity.LawyerProfile;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.entity.Case;
import com.teamthree.legalaid.repository.LawyerRepository;
import com.teamthree.legalaid.repository.CaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LawyerDashboardService {

    private final LawyerRepository lawyerRepository;
    private final CaseRepository caseRepository;

    public LawyerDashboardDTO getDashboardOverview(User user) {
        LawyerProfile lawyer = lawyerRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("Lawyer profile not found"));

        LawyerDashboardDTO dashboard = new LawyerDashboardDTO();
        dashboard.setLawyerId(lawyer.getId());
        dashboard.setFullName(user.getFullname());
        dashboard.setSpecialization(lawyer.getSpecialization());
        dashboard.setExperienceYears(lawyer.getExperienceYears());
        dashboard.setIsAvailable(lawyer.getIsAvailable());
        
        // Case statistics
        dashboard.setAssignedCases(caseRepository.countByAssignedToAndStatus(user, "ACTIVE"));
        dashboard.setCompletedCases(caseRepository.countByAssignedToAndStatus(user, "COMPLETED"));
        dashboard.setPendingCases(caseRepository.countByAssignedToAndStatus(user, "PENDING"));
        
        // Today's schedule - Now returns List<CaseDTO> to match the setter
        dashboard.setTodaySchedule(getTodayScheduleAsCaseDTO(user));
        
        // Recent cases
        dashboard.setRecentCases(getRecentCases(user));
        
        return dashboard;
    }

    public List<CaseDTO> getAssignedCases(User user) {
        return caseRepository.findByAssignedToAndStatusOrderByFiledDateDesc(user, "ACTIVE")
            .stream()
            .map(this::mapToCaseDTO)
            .collect(Collectors.toList());
    }

    public List<CaseDTO> getCompletedCases(User user) {
        return caseRepository.findByAssignedToAndStatusOrderByFiledDateDesc(user, "COMPLETED")
            .stream()
            .map(this::mapToCaseDTO)
            .collect(Collectors.toList());
    }

    public List<CaseDTO> getPendingCases(User user) {
        return caseRepository.findByAssignedToAndStatusOrderByFiledDateDesc(user, "PENDING")
            .stream()
            .map(this::mapToCaseDTO)
            .collect(Collectors.toList());
    }

    public List<ScheduleDTO> getTodaySchedule(User user) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().plusDays(1).atStartOfDay();
        
        return caseRepository.findByAssignedToAndHearingDateBetween(user, startOfDay, endOfDay)
            .stream()
            .map(this::mapToScheduleDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public LawyerProfile updateAvailability(User user, Boolean isAvailable) {
        LawyerProfile lawyer = lawyerRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("Lawyer profile not found"));
        
        lawyer.setIsAvailable(isAvailable);
        return lawyerRepository.save(lawyer);
    }

    private List<CaseDTO> getRecentCases(User user) {
        return caseRepository.findTop5ByAssignedToOrderByFiledDateDesc(user)
            .stream()
            .map(this::mapToCaseDTO)
            .collect(Collectors.toList());
    }

    // New method that returns CaseDTO for the dashboard
    private List<CaseDTO> getTodayScheduleAsCaseDTO(User user) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().plusDays(1).atStartOfDay();
        
        return caseRepository.findByAssignedToAndHearingDateBetween(user, startOfDay, endOfDay)
            .stream()
            .map(this::mapToCaseDTO)
            .collect(Collectors.toList());
    }

    private CaseDTO mapToCaseDTO(Case case_) {
        CaseDTO dto = new CaseDTO();
        dto.setCaseId(case_.getId());
        dto.setCaseTitle(case_.getCaseTitle());
        dto.setDescription(case_.getCaseDescription());
        dto.setStatus(case_.getStatus());
        dto.setFilingDate(case_.getFiledDate());
        dto.setHearingDate(case_.getHearingDate());
        dto.setClientName(case_.getClient() != null ? case_.getClient().getFullname() : null);
        dto.setLawyerName(case_.getAssignedTo() != null ? case_.getAssignedTo().getFullname() : null);
        dto.setNgoName(case_.getNgo() != null ? case_.getNgo().getOrganizationName() : null);
        return dto;
    }

    private ScheduleDTO mapToScheduleDTO(Case case_) {
        return new ScheduleDTO(
            case_.getId(),
            case_.getCaseTitle(),
            case_.getHearingDate(),
            case_.getClient() != null ? case_.getClient().getFullname() : "Unknown",
            case_.getCourtName() != null ? case_.getCourtName() : "Court not specified"
        );
    }
}