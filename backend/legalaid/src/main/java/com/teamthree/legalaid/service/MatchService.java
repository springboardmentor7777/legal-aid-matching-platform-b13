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

    // ── USER sends a direct request to a specific lawyer or NGO ──────────────
    // This replaces the old admin-driven generateMatches flow
    @Transactional
    public MatchDTO sendDirectRequest(User user, Long caseId, Long profileId, String profileType) {
        Case caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found: " + caseId));

        // Verify the case belongs to this user
        if (caseEntity.getClient() == null || !caseEntity.getClient().getId().equals(user.getId()))
            throw new RuntimeException("This case does not belong to you");

        // Case must be OPEN to send requests
        if (!"OPEN".equals(caseEntity.getStatus()))
            throw new RuntimeException("Case is already ASSIGNED — cannot send more requests");

        // Prevent duplicate requests to the same lawyer/NGO for the same case
        boolean alreadyRequested = matchRepository
                .existsByCaseEntityAndProfileIdAndProfileType(caseEntity, profileId, profileType);
        if (alreadyRequested)
            throw new RuntimeException("You already sent a request to this " + profileType);

        // Validate the profile exists
        if ("LAWYER".equals(profileType)) {
            lawyerRepository.findById(profileId)
                    .orElseThrow(() -> new RuntimeException("Lawyer not found: " + profileId));
        } else if ("NGO".equals(profileType)) {
            ngoProfileRepository.findById(profileId)
                    .orElseThrow(() -> new RuntimeException("NGO not found: " + profileId));
        }

        Match match = Match.builder()
                .caseEntity(caseEntity)
                .profileId(profileId)
                .profileType(profileType)
                .matchScore(0)
                .status("REQUESTED")   // directly REQUESTED — no PENDING stage
                .matchDate(LocalDateTime.now())
                .build();

        Match saved = matchRepository.save(match);

        // Notify the lawyer/NGO
        Long profileUserId = resolveProfileUserId(saved);
        if (profileUserId != null) {
            notificationService.saveNotification(Notification.builder()
                    .userId(profileUserId)
                    .message("New case request from " + user.getFullname() + ": " + caseEntity.getCaseTitle())
                    .type("MATCH_REQUESTED").read(false).build());
        }

        return mapToDTO(saved);
    }

    // ── USER: get all their matches (requests they sent) ─────────────────────
    public List<MatchDTO> getMyMatches(User user) {
        List<Case> cases = caseRepository.findByClientOrderByFiledDateDesc(user);
        List<Match> all = new ArrayList<>();
        for (Case c : cases)
            all.addAll(matchRepository.findByCaseEntityOrderByMatchScoreDesc(c));
        return all.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    // ── LAWYER: get their incoming requests (exclude CANCELLED) ──────────────
    public List<MatchDTO> getMatchesForLawyer(Long lawyerProfileId) {
        return matchRepository.findByProfileIdAndProfileType(lawyerProfileId, "LAWYER")
                .stream()
                .filter(m -> !"CANCELLED".equals(m.getStatus())) // CANCELLED = case taken by someone else
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ── NGO: get their incoming requests (exclude CANCELLED) ─────────────────
    public List<MatchDTO> getMatchesForNgo(Long ngoProfileId) {
        return matchRepository.findByProfileIdAndProfileType(ngoProfileId, "NGO")
                .stream()
                .filter(m -> !"CANCELLED".equals(m.getStatus()))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ── LAWYER/NGO: ACCEPT a case ─────────────────────────────────────────────
    @Transactional
    public MatchDTO acceptMatch(Long matchId, User user) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found: " + matchId));

        validateOwnership(match, user);

        if (!"REQUESTED".equals(match.getStatus()))
            throw new RuntimeException("Only REQUESTED matches can be accepted");

        // Accept this match
        match.setStatus("ACCEPTED");
        Case c = match.getCaseEntity();

        // Case status → ASSIGNED
        if (c != null) {
            c.setStatus("ASSIGNED");
            caseRepository.save(c);
        }

        Match saved = matchRepository.save(match);

        // CANCEL all other REQUESTED/PENDING matches for the same case
        // So other lawyers/NGOs no longer see this case request
        if (c != null) {
            List<Match> others = matchRepository.findByCaseEntityOrderByMatchScoreDesc(c);
            for (Match other : others) {
                if (!other.getId().equals(matchId)
                        && ("REQUESTED".equals(other.getStatus()) || "PENDING".equals(other.getStatus()))) {
                    other.setStatus("CANCELLED");
                    matchRepository.save(other);
                    // Optionally notify the other lawyers/NGOs
                    Long otherId = resolveProfileUserId(other);
                    if (otherId != null) {
                        notificationService.saveNotification(Notification.builder()
                                .userId(otherId)
                                .message("Case '" + c.getCaseTitle() + "' has been assigned to another advisor")
                                .type("MATCH_CANCELLED").read(false).build());
                    }
                }
            }
        }

        // Notify the citizen
        if (c != null && c.getClient() != null) {
            notificationService.saveNotification(Notification.builder()
                    .userId(c.getClient().getId())
                    .message(profileName(match) + " accepted your case: " + c.getCaseTitle())
                    .type("MATCH_ACCEPTED").read(false).build());
        }

        return mapToDTO(saved);
    }

    // ── LAWYER/NGO: REJECT a case ─────────────────────────────────────────────
    @Transactional
    public MatchDTO rejectMatch(Long matchId, User user) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found: " + matchId));

        validateOwnership(match, user);

        if (!"REQUESTED".equals(match.getStatus()))
            throw new RuntimeException("Only REQUESTED matches can be rejected");

        match.setStatus("REJECTED");
        Match saved = matchRepository.save(match);

        // Notify the citizen
        Case c = match.getCaseEntity();
        if (c != null && c.getClient() != null) {
            notificationService.saveNotification(Notification.builder()
                    .userId(c.getClient().getId())
                    .message(profileName(match) + " declined your case: " + c.getCaseTitle())
                    .type("MATCH_REJECTED").read(false).build());
        }

        return mapToDTO(saved);
    }

    // ── USER: cancel a pending request ───────────────────────────────────────
    @Transactional
    public MatchDTO cancelRequest(Long matchId, User user) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found: " + matchId));

        if (match.getCaseEntity() == null || match.getCaseEntity().getClient() == null
                || !match.getCaseEntity().getClient().getId().equals(user.getId()))
            throw new RuntimeException("Not authorised");

        match.setStatus("CANCELLED");
        return mapToDTO(matchRepository.save(match));
    }

    // ── Private helpers ───────────────────────────────────────────────────────
    private void validateOwnership(Match match, User user) {
        if ("LAWYER".equals(match.getProfileType())) {
            lawyerRepository.findByUser(user)
                    .filter(lp -> lp.getId().equals(match.getProfileId()))
                    .orElseThrow(() -> new RuntimeException("Not authorised to act on this match"));
        } else {
            ngoProfileRepository.findByUser(user)
                    .filter(np -> np.getId().equals(match.getProfileId()))
                    .orElseThrow(() -> new RuntimeException("Not authorised to act on this match"));
        }
    }

    private Long resolveProfileUserId(Match match) {
        if ("LAWYER".equals(match.getProfileType()))
            return lawyerRepository.findById(match.getProfileId())
                    .map(lp -> lp.getUser() != null ? lp.getUser().getId() : null).orElse(null);
        if ("NGO".equals(match.getProfileType()))
            return ngoProfileRepository.findById(match.getProfileId())
                    .map(np -> np.getUser() != null ? np.getUser().getId() : null).orElse(null);
        return null;
    }

    private String profileName(Match match) {
        if ("LAWYER".equals(match.getProfileType()))
            return lawyerRepository.findById(match.getProfileId())
                    .map(lp -> lp.getUser() != null ? lp.getUser().getFullname() : "Lawyer").orElse("Lawyer");
        if ("NGO".equals(match.getProfileType()))
            return ngoProfileRepository.findById(match.getProfileId())
                    .map(NgoProfile::getOrganizationName).orElse("NGO");
        return "Advisor";
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
            if (match.getCaseEntity().getClient() != null)
                dto.setClientName(match.getCaseEntity().getClient().getFullname());
        }

        if ("LAWYER".equals(match.getProfileType())) {
            lawyerRepository.findById(match.getProfileId()).ifPresent(l -> {
                dto.setProfileName(l.getUser() != null ? l.getUser().getFullname() : "Unknown");
                dto.setProfileExpertise(l.getExpertise());
                dto.setProfileLocation(l.getLocation());
                dto.setProfileVerified(l.getVerified());
                dto.setExperienceYears(l.getExperienceYears());
            });
        } else if ("NGO".equals(match.getProfileType())) {
            ngoProfileRepository.findById(match.getProfileId()).ifPresent(n -> {
                dto.setProfileName(n.getOrganizationName());
                dto.setProfileExpertise(n.getExpertise());
                dto.setProfileLocation(n.getLocation());
                dto.setProfileVerified(n.getVerified());
            });
        }

        return dto;
    }
}