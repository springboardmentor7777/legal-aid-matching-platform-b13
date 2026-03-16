package com.teamthree.legalaid.service;

import com.teamthree.legalaid.dto.MatchDTO;
import com.teamthree.legalaid.entity.Case;
import com.teamthree.legalaid.entity.LawyerProfile;
import com.teamthree.legalaid.entity.Match;
import com.teamthree.legalaid.entity.NgoProfile;
import com.teamthree.legalaid.entity.Notification;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.repository.CaseRepository;
import com.teamthree.legalaid.repository.LawyerRepository;
import com.teamthree.legalaid.repository.MatchRepository;
import com.teamthree.legalaid.repository.NgoProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final CaseRepository caseRepository;
    private final LawyerRepository lawyerRepository;
    private final NgoProfileRepository ngoProfileRepository;
    private final NotificationService notificationService;

    @Transactional
    public List<MatchDTO> generateMatches(Long caseId) {

        Case caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found: " + caseId));

        List<Match> newMatches = new ArrayList<>();

        List<LawyerProfile> lawyers = lawyerRepository.findAll();

        for (LawyerProfile lawyer : lawyers) {

            if (matchRepository.existsByCaseEntityAndProfileIdAndProfileType(
                    caseEntity, lawyer.getId(), "LAWYER")) {
                continue;
            }

            int score = calculateLawyerScore(caseEntity, lawyer);

            if (score > 0) {
                Match match = Match.builder()
                        .caseEntity(caseEntity)
                        .profileId(lawyer.getId())
                        .profileType("LAWYER")
                        .matchScore(score)
                        .status("PENDING")
                        .matchDate(LocalDateTime.now())
                        .build();

                newMatches.add(match);
            }
        }

        List<NgoProfile> ngos = ngoProfileRepository.findAll();

        for (NgoProfile ngo : ngos) {

            if (matchRepository.existsByCaseEntityAndProfileIdAndProfileType(
                    caseEntity, ngo.getId(), "NGO")) {
                continue;
            }

            int score = calculateNgoScore(caseEntity, ngo);

            if (score > 0) {
                Match match = Match.builder()
                        .caseEntity(caseEntity)
                        .profileId(ngo.getId())
                        .profileType("NGO")
                        .matchScore(score)
                        .status("PENDING")
                        .matchDate(LocalDateTime.now())
                        .build();

                newMatches.add(match);
            }
        }

        List<Match> saved = matchRepository.saveAll(newMatches);

        // Notify the citizen that matches were found
        if (!saved.isEmpty() && caseEntity.getClient() != null) {
            notificationService.saveNotification(Notification.builder()
                    .userId(caseEntity.getClient().getId())
                    .message(saved.size() + " match(es) found for your case: " + caseEntity.getCaseTitle())
                    .type("NEW_MATCH")
                    .read(false)
                    .build());
        }

        return saved.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<MatchDTO> getMyMatches(User user) {

        List<Case> userCases = caseRepository.findByClientOrderByFiledDateDesc(user);

        List<Match> allMatches = new ArrayList<>();

        for (Case c : userCases) {
            allMatches.addAll(matchRepository.findByCaseEntityOrderByMatchScoreDesc(c));
        }

        return allMatches.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<MatchDTO> getMatchesForLawyer(Long lawyerProfileId) {
        return matchRepository.findByProfileIdAndProfileType(lawyerProfileId, "LAWYER")
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<MatchDTO> getMatchesForLawyerUser(User user) {
        return lawyerRepository.findByUser(user)
                .map(lawyer -> matchRepository.findByProfileIdAndProfileType(lawyer.getId(), "LAWYER")
                        .stream()
                        .map(this::mapToDTO)
                        .collect(Collectors.toList()))
                .orElse(new ArrayList<>());
    }

    public List<MatchDTO> getMatchesForNgo(Long ngoProfileId) {
        return matchRepository.findByProfileIdAndProfileType(ngoProfileId, "NGO")
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<MatchDTO> getMatchesForNgoUser(User user) {
        return ngoProfileRepository.findByUser(user)
                .map(ngo -> matchRepository.findByProfileIdAndProfileType(ngo.getId(), "NGO")
                        .stream()
                        .map(this::mapToDTO)
                        .collect(Collectors.toList()))
                .orElse(new ArrayList<>());
    }

    @Transactional
    public MatchDTO requestMatch(Long matchId, User user) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found: " + matchId));

        match.setStatus("REQUESTED");

        // Notify the lawyer/NGO that user has sent a request
        if ("LAWYER".equals(match.getProfileType())) {
            lawyerRepository.findById(match.getProfileId()).ifPresent(lawyer -> {
                if (lawyer.getUser() != null) {
                    notificationService.saveNotification(Notification.builder()
                            .userId(lawyer.getUser().getId())
                            .message(user.getFullname() + " has requested your help for case: " + match.getCaseEntity().getCaseTitle())
                            .type("MATCH_REQUESTED")
                            .read(false)
                            .build());
                }
            });
        } else if ("NGO".equals(match.getProfileType())) {
            ngoProfileRepository.findById(match.getProfileId()).ifPresent(ngo -> {
                if (ngo.getUser() != null) {
                    notificationService.saveNotification(Notification.builder()
                            .userId(ngo.getUser().getId())
                            .message(user.getFullname() + " has requested your help for case: " + match.getCaseEntity().getCaseTitle())
                            .type("MATCH_REQUESTED")
                            .read(false)
                            .build());
                }
            });
        }

        return mapToDTO(matchRepository.save(match));
    }

    @Transactional
    public MatchDTO acceptMatch(Long matchId) {

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found: " + matchId));

        match.setStatus("ACCEPTED");

        Case caseEntity = match.getCaseEntity();
        caseEntity.setStatus("ACTIVE");

        // Assign the lawyer/NGO to the case
        if ("LAWYER".equals(match.getProfileType())) {
            lawyerRepository.findById(match.getProfileId()).ifPresent(lawyer -> {
                if (lawyer.getUser() != null) {
                    caseEntity.setAssignedTo(lawyer.getUser());
                }
            });
        } else if ("NGO".equals(match.getProfileType())) {
            ngoProfileRepository.findById(match.getProfileId()).ifPresent(ngo -> {
                caseEntity.setNgo(ngo);
            });
        }

        caseRepository.save(caseEntity);

        // Notify the citizen their match was accepted
        if (caseEntity.getClient() != null) {
            notificationService.saveNotification(Notification.builder()
                    .userId(caseEntity.getClient().getId())
                    .message("Your case \"" + caseEntity.getCaseTitle() + "\" has been accepted by " + match.getProfileType())
                    .type("MATCH_ACCEPTED")
                    .read(false)
                    .build());
        }

        return mapToDTO(matchRepository.save(match));
    }

    @Transactional
    public MatchDTO rejectMatch(Long matchId) {

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found: " + matchId));

        match.setStatus("REJECTED");

        // Notify the citizen their match was rejected
        Case caseEntity = match.getCaseEntity();
        if (caseEntity != null && caseEntity.getClient() != null) {
            notificationService.saveNotification(Notification.builder()
                    .userId(caseEntity.getClient().getId())
                    .message("A match for your case \"" + caseEntity.getCaseTitle() + "\" was declined.")
                    .type("MATCH_REJECTED")
                    .read(false)
                    .build());
        }

        return mapToDTO(matchRepository.save(match));
    }

    private int calculateLawyerScore(Case caseEntity, LawyerProfile lawyer) {

        int score = 0;

        if (lawyer.getExpertise() != null && caseEntity.getCategory() != null) {
            if (lawyer.getExpertise().toLowerCase()
                    .contains(caseEntity.getCategory().toLowerCase())) {
                score += 40;
            }
        }

        if (lawyer.getLocation() != null && caseEntity.getLocation() != null) {
            if (lawyer.getLocation().toLowerCase()
                    .contains(caseEntity.getLocation().toLowerCase())) {
                score += 30;
            }
        }

        if (Boolean.TRUE.equals(lawyer.getVerified())) {
            score += 20;
        }

        if (Boolean.TRUE.equals(lawyer.getIsAvailable())) {
            score += 10;
        }

        return score;
    }

    private int calculateNgoScore(Case caseEntity, NgoProfile ngo) {

        int score = 0;

        if (ngo.getExpertise() != null && caseEntity.getCategory() != null) {
            if (ngo.getExpertise().toLowerCase()
                    .contains(caseEntity.getCategory().toLowerCase())) {
                score += 40;
            }
        }

        if (ngo.getLocation() != null && caseEntity.getLocation() != null) {
            if (ngo.getLocation().toLowerCase()
                    .contains(caseEntity.getLocation().toLowerCase())) {
                score += 30;
            }
        }

        if (Boolean.TRUE.equals(ngo.getVerified())) {
            score += 20;
        }

        if (Boolean.TRUE.equals(ngo.getIsActive())) {
            score += 10;
        }

        return score;
    }

    private MatchDTO mapToDTO(Match match) {

        MatchDTO dto = new MatchDTO();

        dto.setId(match.getId());
        dto.setProfileId(match.getProfileId());
        dto.setProfileType(match.getProfileType());
        dto.setMatchScore(match.getMatchScore());
        dto.setStatus(match.getStatus());
        dto.setMatchDate(match.getMatchDate());
        dto.setCreatedAt(match.getCreatedAt());

        if (match.getCaseEntity() != null) {

            dto.setCaseId(match.getCaseEntity().getId());
            dto.setCaseTitle(match.getCaseEntity().getCaseTitle());
            dto.setCaseCategory(match.getCaseEntity().getCategory());
            dto.setCaseLocation(match.getCaseEntity().getLocation());
        }

        if ("LAWYER".equals(match.getProfileType())) {

            lawyerRepository.findById(match.getProfileId()).ifPresent(lawyer -> {

                dto.setProfileName(
                        lawyer.getUser() != null
                                ? lawyer.getUser().getFullname()
                                : "Unknown"
                );

                dto.setProfileExpertise(lawyer.getExpertise());
                dto.setProfileLocation(lawyer.getLocation());
                dto.setProfileVerified(lawyer.getVerified());
                dto.setExperienceYears(lawyer.getExperienceYears());
            });

        } else if ("NGO".equals(match.getProfileType())) {

            ngoProfileRepository.findById(match.getProfileId()).ifPresent(ngo -> {

                dto.setProfileName(ngo.getOrganizationName());
                dto.setProfileExpertise(ngo.getExpertise());
                dto.setProfileLocation(ngo.getLocation());
                dto.setProfileVerified(ngo.getVerified());
            });
        }

        return dto;
    }
}