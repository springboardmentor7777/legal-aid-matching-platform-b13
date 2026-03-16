package com.teamthree.legalaid.dashboard.service;

import com.teamthree.legalaid.dashboard.dto.UserDashboardDTO;
import com.teamthree.legalaid.dto.ActivityDTO;
import com.teamthree.legalaid.dto.CaseDTO;
import com.teamthree.legalaid.dto.RecentCaseDTO;
import com.teamthree.legalaid.entity.Case;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.repository.CaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

        dashboard.setTotalCases(caseRepository.countByClient(user));
        dashboard.setActiveCases(caseRepository.countByClientAndStatus(user, "ACTIVE"));
        dashboard.setResolvedCases(caseRepository.countByClientAndStatus(user, "RESOLVED"));

        dashboard.setAssignedLawyerName(getAssignedLawyerName(user));
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
        return caseRepository.findByClientAndStatusIn(user, List.of("ACTIVE", "PENDING", "SUBMITTED"))
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
            .map(case_ -> case_.getAssignedTo() != null
                ? case_.getAssignedTo().getFullname()
                : "Not assigned")
            .orElse("Not assigned");
    }

    public List<ActivityDTO> getRecentActivities(User user) {
        return caseRepository.findRecentActivitiesByUser(user.getId())
            .stream()
            .map(activity -> new ActivityDTO(
                ((Number) activity[0]).longValue(),
                (String) activity[1],
                (String) activity[2],
                (LocalDateTime) activity[3]
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
                case_.getAssignedTo() != null ? case_.getAssignedTo().getFullname() : "Unassigned",
                case_.getCategory(),
                case_.getLocation()
            ))
            .collect(Collectors.toList());
    }

    private CaseDTO mapToCaseDTO(Case case_) {
        CaseDTO dto = new CaseDTO();
        dto.setId(case_.getId());
        dto.setCaseId(case_.getId());
        dto.setTitle(case_.getCaseTitle());
        dto.setCaseTitle(case_.getCaseTitle());
        dto.setDescription(case_.getCaseDescription() != null
            ? case_.getCaseDescription() : case_.getDescription());
        dto.setCategory(case_.getCategory());
        dto.setLocation(case_.getLocation());
        dto.setStatus(case_.getStatus());
        dto.setCreatedAt(case_.getCreatedAt());
        dto.setUpdatedAt(case_.getUpdatedAt());
        dto.setFilingDate(case_.getFiledDate());
        dto.setHearingDate(case_.getHearingDate());                          // fixed: was overwriting filingDate
        dto.setClientName(case_.getClient() != null
            ? case_.getClient().getFullname() : null);                       // fixed: was using setUserName
        dto.setLawyerName(case_.getAssignedTo() != null
            ? case_.getAssignedTo().getFullname() : null);                   // fixed: was overwriting clientName
        dto.setNgoName(case_.getNgo() != null
            ? case_.getNgo().getOrganizationName() : null);                  // fixed: was overwriting lawyerName
        return dto;
    }
}