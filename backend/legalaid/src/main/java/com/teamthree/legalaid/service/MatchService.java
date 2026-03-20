package com.teamthree.legalaid.service;

import com.teamthree.legalaid.dto.MatchDTO;
import com.teamthree.legalaid.entity.Case;
import com.teamthree.legalaid.entity.LawyerProfile;
import com.teamthree.legalaid.entity.Match;
import com.teamthree.legalaid.entity.Notification;
import com.teamthree.legalaid.entity.NgoProfile;
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
        for (LawyerProfile lawyer : lawyerRepository.findAll()) {
            if (matchRepository.existsByCaseEntityAndProfileIdAndProfileType(caseEntity, lawyer.getId(), "LAWYER")) continue;
            int score = calcLawyerScore(caseEntity, lawyer);
            if (score > 0) newMatches.add(Match.builder().caseEntity(caseEntity).profileId(lawyer.getId())
                    .profileType("LAWYER").matchScore(score).status("PENDING").matchDate(LocalDateTime.now()).build());
        }
        for (NgoProfile ngo : ngoProfileRepository.findAll()) {
            if (matchRepository.existsByCaseEntityAndProfileIdAndProfileType(caseEntity, ngo.getId(), "NGO")) continue;
            int score = calcNgoScore(caseEntity, ngo);
            if (score > 0) newMatches.add(Match.builder().caseEntity(caseEntity).profileId(ngo.getId())
                    .profileType("NGO").matchScore(score).status("PENDING").matchDate(LocalDateTime.now()).build());
        }
        List<Match> saved = matchRepository.saveAll(newMatches);
        if (!saved.isEmpty() && caseEntity.getClient() != null) {
            notificationService.saveNotification(Notification.builder()
                    .userId(caseEntity.getClient().getId())
                    .message(saved.size() + " new match(es) found for: " + caseEntity.getCaseTitle())
                    .type("NEW_MATCH").read(false).build());
        }
        return saved.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<MatchDTO> getMyMatches(User user) {
        List<Case> cases = caseRepository.findByClientOrderByFiledDateDesc(user);
        List<Match> all = new ArrayList<>();
        for (Case c : cases) all.addAll(matchRepository.findByCaseEntityOrderByMatchScoreDesc(c));
        return all.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<MatchDTO> getMatchesForLawyer(Long lawyerProfileId) {
        return matchRepository.findByProfileIdAndProfileType(lawyerProfileId, "LAWYER")
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<MatchDTO> getMatchesForNgo(Long ngoProfileId) {
        return matchRepository.findByProfileIdAndProfileType(ngoProfileId, "NGO")
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // USER: PENDING → REQUESTED
    @Transactional
    public MatchDTO requestMatch(Long matchId, User user) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found: " + matchId));
        if (match.getCaseEntity() == null || match.getCaseEntity().getClient() == null
                || !match.getCaseEntity().getClient().getId().equals(user.getId()))
            throw new RuntimeException("Not authorised to request this match");
        if (!"PENDING".equals(match.getStatus()))
            throw new RuntimeException("Only PENDING matches can be requested");
        match.setStatus("REQUESTED");
        Match saved = matchRepository.save(match);
        Long profileUserId = resolveProfileUserId(match);
        if (profileUserId != null)
            notificationService.saveNotification(Notification.builder().userId(profileUserId)
                    .message("New case request from " + user.getFullname() + " for: " + match.getCaseEntity().getCaseTitle())
                    .type("MATCH_REQUESTED").read(false).build());
        return mapToDTO(saved);
    }

    // LAWYER/NGO: REQUESTED → ACCEPTED
    @Transactional
    public MatchDTO acceptMatch(Long matchId, User user) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found: " + matchId));
        validateOwnership(match, user);
        if (!"REQUESTED".equals(match.getStatus()))
            throw new RuntimeException("Only REQUESTED matches can be accepted");
        match.setStatus("ACCEPTED");
        Case c = match.getCaseEntity();
        if (c != null) { c.setStatus("ACTIVE"); caseRepository.save(c); }
        Match saved = matchRepository.save(match);
        if (c != null && c.getClient() != null)
            notificationService.saveNotification(Notification.builder().userId(c.getClient().getId())
                    .message(profileName(match) + " accepted your case: " + c.getCaseTitle())
                    .type("MATCH_ACCEPTED").read(false).build());
        return mapToDTO(saved);
    }

    // LAWYER/NGO: REQUESTED → REJECTED
    @Transactional
    public MatchDTO rejectMatch(Long matchId, User user) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found: " + matchId));
        validateOwnership(match, user);
        if (!"REQUESTED".equals(match.getStatus()))
            throw new RuntimeException("Only REQUESTED matches can be rejected");
        match.setStatus("REJECTED");
        Match saved = matchRepository.save(match);
        Case c = match.getCaseEntity();
        if (c != null && c.getClient() != null)
            notificationService.saveNotification(Notification.builder().userId(c.getClient().getId())
                    .message(profileName(match) + " declined your case: " + c.getCaseTitle())
                    .type("MATCH_REJECTED").read(false).build());
        return mapToDTO(saved);
    }

    private void validateOwnership(Match match, User user) {
        if ("LAWYER".equals(match.getProfileType())) {
            lawyerRepository.findByUser(user).filter(lp -> lp.getId().equals(match.getProfileId()))
                    .orElseThrow(() -> new RuntimeException("Not authorised to act on this match"));
        } else {
            ngoProfileRepository.findByUser(user).filter(np -> np.getId().equals(match.getProfileId()))
                    .orElseThrow(() -> new RuntimeException("Not authorised to act on this match"));
        }
    }

    private Long resolveProfileUserId(Match match) {
        if ("LAWYER".equals(match.getProfileType()))
            return lawyerRepository.findById(match.getProfileId()).map(lp -> lp.getUser() != null ? lp.getUser().getId() : null).orElse(null);
        if ("NGO".equals(match.getProfileType()))
            return ngoProfileRepository.findById(match.getProfileId()).map(np -> np.getUser() != null ? np.getUser().getId() : null).orElse(null);
        return null;
    }

    private String profileName(Match match) {
        if ("LAWYER".equals(match.getProfileType()))
            return lawyerRepository.findById(match.getProfileId()).map(lp -> lp.getUser() != null ? lp.getUser().getFullname() : "Lawyer").orElse("Lawyer");
        if ("NGO".equals(match.getProfileType()))
            return ngoProfileRepository.findById(match.getProfileId()).map(NgoProfile::getOrganizationName).orElse("NGO");
        return "Advisor";
    }

    private int calcLawyerScore(Case c, LawyerProfile l) {
        int s = 0;
        if (l.getExpertise() != null && c.getCategory() != null && l.getExpertise().toLowerCase().contains(c.getCategory().toLowerCase())) s += 40;
        if (l.getLocation() != null && c.getLocation() != null && l.getLocation().toLowerCase().contains(c.getLocation().toLowerCase())) s += 30;
        if (Boolean.TRUE.equals(l.getVerified())) s += 20;
        if (Boolean.TRUE.equals(l.getIsAvailable())) s += 10;
        return s;
    }

    private int calcNgoScore(Case c, NgoProfile n) {
        int s = 0;
        if (n.getExpertise() != null && c.getCategory() != null && n.getExpertise().toLowerCase().contains(c.getCategory().toLowerCase())) s += 40;
        if (n.getLocation() != null && c.getLocation() != null && n.getLocation().toLowerCase().contains(c.getLocation().toLowerCase())) s += 30;
        if (Boolean.TRUE.equals(n.getVerified())) s += 20;
        if (Boolean.TRUE.equals(n.getIsActive())) s += 10;
        return s;
    }

    private MatchDTO mapToDTO(Match match) {
        MatchDTO dto = new MatchDTO();
        dto.setId(match.getId()); dto.setProfileId(match.getProfileId()); dto.setProfileType(match.getProfileType());
        dto.setMatchScore(match.getMatchScore()); dto.setStatus(match.getStatus());
        dto.setMatchDate(match.getMatchDate()); dto.setCreatedAt(match.getCreatedAt());
        if (match.getCaseEntity() != null) {
            dto.setCaseId(match.getCaseEntity().getId()); dto.setCaseTitle(match.getCaseEntity().getCaseTitle());
            dto.setCaseCategory(match.getCaseEntity().getCategory()); dto.setCaseLocation(match.getCaseEntity().getLocation());
        }
        if ("LAWYER".equals(match.getProfileType())) {
            lawyerRepository.findById(match.getProfileId()).ifPresent(l -> {
                dto.setProfileName(l.getUser() != null ? l.getUser().getFullname() : "Unknown");
                dto.setProfileExpertise(l.getExpertise()); dto.setProfileLocation(l.getLocation());
                dto.setProfileVerified(l.getVerified()); dto.setExperienceYears(l.getExperienceYears());
            });
        } else if ("NGO".equals(match.getProfileType())) {
            ngoProfileRepository.findById(match.getProfileId()).ifPresent(n -> {
                dto.setProfileName(n.getOrganizationName()); dto.setProfileExpertise(n.getExpertise());
                dto.setProfileLocation(n.getLocation()); dto.setProfileVerified(n.getVerified());
            });
        }
        return dto;
    }
}