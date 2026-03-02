package com.teamthree.legalaid.dashboard.service;

import com.teamthree.legalaid.dashboard.dto.NgoDashboardDTO;
import com.teamthree.legalaid.dto.*;
import com.teamthree.legalaid.entity.NgoProfile;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.entity.Case;
import com.teamthree.legalaid.entity.LawyerProfile;
import com.teamthree.legalaid.repository.NgoProfileRepository;
import com.teamthree.legalaid.repository.CaseRepository;
import com.teamthree.legalaid.repository.LawyerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NgoDashboardService {

    private final NgoProfileRepository ngoProfileRepository;
    private final CaseRepository caseRepository;
    private final LawyerRepository lawyerRepository;

    public NgoDashboardDTO getDashboardOverview(User user) {
        NgoProfile ngo = ngoProfileRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("NGO profile not found"));

        NgoDashboardDTO dashboard = new NgoDashboardDTO();
        
        dashboard.setNgoId(ngo.getId());
        dashboard.setOrganizationName(ngo.getOrganizationName());
        dashboard.setRegistrationNumber(ngo.getRegistrationNumber());
        
        // Case statistics
        dashboard.setTotalCases(caseRepository.countByNgo(ngo));
        dashboard.setActiveCases(caseRepository.countByNgoAndStatus(ngo, "ACTIVE"));
        dashboard.setResolvedCases(caseRepository.countByNgoAndStatus(ngo, "RESOLVED"));
        
        // Assigned lawyers count
        dashboard.setAssignedLawyers(caseRepository.countDistinctLawyersByNgo(ngo));
        
        // Lists
        dashboard.setAssignedCases(getAssignedCases(ngo));
        dashboard.setAvailableLawyers(getAvailableLawyers());
        
        return dashboard;
    }

    public List<CaseDTO> getAssignedCases(User user) {
        NgoProfile ngo = ngoProfileRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("NGO profile not found"));
        
        return getAssignedCases(ngo);
    }

    public List<CaseDTO> getCompletedCases(User user) {
        NgoProfile ngo = ngoProfileRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("NGO profile not found"));
        
        return caseRepository.findByNgoAndStatus(ngo, "COMPLETED")
            .stream()
            .map(this::mapToCaseDTO)
            .collect(Collectors.toList());
    }

    public List<LawyerDTO> getAvailableLawyers() {
        return lawyerRepository.findByIsAvailableTrue()
            .stream()
            .map(this::mapToLawyerDTO)
            .collect(Collectors.toList());
    }

    public Map<String, Object> getOrganizationStatistics(User user) {
        NgoProfile ngo = ngoProfileRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("NGO profile not found"));
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCases", caseRepository.countByNgo(ngo));
        stats.put("activeCases", caseRepository.countByNgoAndStatus(ngo, "ACTIVE"));
        stats.put("resolvedCases", caseRepository.countByNgoAndStatus(ngo, "RESOLVED"));
        stats.put("pendingCases", caseRepository.countByNgoAndStatus(ngo, "PENDING"));
        stats.put("assignedLawyers", caseRepository.countDistinctLawyersByNgo(ngo));
        stats.put("organizationName", ngo.getOrganizationName());
        stats.put("registrationNumber", ngo.getRegistrationNumber());
        stats.put("isActive", ngo.getIsActive());
        
        return stats;
    }

    public List<CaseDTO> getUpcomingHearings(User user) {
        NgoProfile ngo = ngoProfileRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("NGO profile not found"));
        
        return caseRepository.findByNgoAndHearingDateAfterOrderByHearingDateAsc(ngo, LocalDateTime.now())
            .stream()
            .map(this::mapToCaseDTO)
            .collect(Collectors.toList());
    }

    private List<CaseDTO> getAssignedCases(NgoProfile ngo) {
        return caseRepository.findByNgoOrderByFiledDateDesc(ngo)
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

    private LawyerDTO mapToLawyerDTO(LawyerProfile lawyer) {
        LawyerDTO dto = new LawyerDTO();
        dto.setLawyerId(lawyer.getId());
        dto.setFullName(lawyer.getUser() != null ? lawyer.getUser().getFullname() : null);
        dto.setEmail(lawyer.getUser() != null ? lawyer.getUser().getEmail() : null);
        dto.setSpecialization(lawyer.getSpecialization());
        dto.setExperienceYears(lawyer.getExperienceYears());
        dto.setIsAvailable(lawyer.getIsAvailable());
        
        // Count assigned cases for this lawyer
        Long assignedCases = caseRepository.countByAssignedToAndStatus(
            lawyer.getUser(), "ASSIGNED");
        dto.setAssignedCasesCount(assignedCases);
        
        return dto;
    }
}