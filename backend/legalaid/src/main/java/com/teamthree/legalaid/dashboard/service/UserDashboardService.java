package com.teamthree.legalaid.dashboard.service;

import com.teamthree.legalaid.dashboard.dto.UserDashboardDTO;
import com.teamthree.legalaid.dto.*;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.entity.Case;
import com.teamthree.legalaid.repository.CaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserDashboardService {

    private final CaseRepository caseRepository;
 
    public UserDashboardDTO getDashboardOverview(User user) {
        UserDashboardDTO dashboard = new UserDashboardDTO();
        
        dashboard.setUserId(user.getId());
        dashboard.setFullName(user.getFullname());
        dashboard.setEmail(user.getEmail());
        
        // Case statistics
        dashboard.setTotalCases(caseRepository.countByClient(user));
        dashboard.setActiveCases(caseRepository.countByClientAndStatus(user, "ACTIVE"));
        dashboard.setResolvedCases(caseRepository.countByClientAndStatus(user, "RESOLVED"));
        
        // Assigned lawyer
        dashboard.setAssignedLawyerName(getAssignedLawyerName(user));
        
        // Recent cases and activities
        dashboard.setRecentCases(getRecentCases(user));
        dashboard.setRecentActivities(getRecentActivities(user));
        
        return dashboard;
    }

    public List<CaseDTO> getMyCases(User user) {
        return caseRepository.findByClientOrderByFiledDateDesc(user)
            .stream()
            .map(this::mapToCaseDTO)
            .collect(Collectors.toList());
    }

    public List<CaseDTO> getActiveCases(User user) {
        return caseRepository.findByClientAndStatusIn(user, List.of("ACTIVE", "PENDING"))
            .stream()
            .map(this::mapToCaseDTO)
            .collect(Collectors.toList());
    }

    public List<CaseDTO> getResolvedCases(User user) {
        return caseRepository.findByClientAndStatus(user, "RESOLVED")
            .stream()
            .map(this::mapToCaseDTO)
            .collect(Collectors.toList());
    }

    public String getAssignedLawyerName(User user) {
        return caseRepository.findFirstByClientOrderByFiledDateDesc(user)
            .map(case_ -> case_.getAssignedTo() != null ? 
                case_.getAssignedTo().getFullname() : "Not assigned")
            .orElse("Not assigned");
    }

    public List<ActivityDTO> getRecentActivities(User user) {
        return caseRepository.findRecentActivitiesByUser(user)
            .stream()
            .map(activity -> new ActivityDTO(
                (Long) activity[0],
                (String) activity[1],
                (String) activity[2],
                (java.time.LocalDateTime) activity[3]
            ))
            .collect(Collectors.toList());
    }

    private List<RecentCaseDTO> getRecentCases(User user) {
        return caseRepository.findTop5ByClientOrderByFiledDateDesc(user)
            .stream()
            .map(case_ -> new RecentCaseDTO(
                case_.getId(),
                case_.getCaseTitle(),
                case_.getStatus(),
                case_.getFiledDate(),
                case_.getAssignedTo() != null ? case_.getAssignedTo().getFullname() : "Unassigned"
            ))
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
}