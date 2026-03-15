package com.teamthree.legalaid.service;

import com.teamthree.legalaid.dto.MatchDTO;
import com.teamthree.legalaid.entity.Case;
import com.teamthree.legalaid.entity.LawyerProfile;
import com.teamthree.legalaid.entity.Match;
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

    @Transactional
    public List<MatchDTO> generateMatches(Long caseId) {

        Case caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found: " + caseId));

        List<Match> newMatches = new ArrayList<>();

        List<LawyerProfile> lawyers = lawyerRepository.findAll();

        for (LawyerProfile lawyer : lawyers) {
        	//System.out.println("Checking lawyer: " + lawyer.getId());

            if (matchRepository.existsByCaseEntityAndProfileIdAndProfileType(
                    caseEntity, lawyer.getId(), "LAWYER")) {
            	//System.out.println("Match already exists for profile: " + lawyer.getId());
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
        	//System.out.println("Checking NGO: " + ngo.getId());

            if (matchRepository.existsByCaseEntityAndProfileIdAndProfileType(
                    caseEntity, ngo.getId(), "NGO")) {
            	//System.out.println("Match already exists for NGO profile: " + ngo.getId());
                continue;
            }

            int score = calculateNgoScore(caseEntity, ngo);
            //System.out.println("Score for NGO " + ngo.getId() + " = " + score);

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

    public List<MatchDTO> getMatchesForNgo(Long ngoProfileId) {
        return matchRepository.findByProfileIdAndProfileType(ngoProfileId, "NGO")
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public MatchDTO acceptMatch(Long matchId) {

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found: " + matchId));

        match.setStatus("ACCEPTED");

        Case caseEntity = match.getCaseEntity();
        caseEntity.setStatus("ACTIVE");

        caseRepository.save(caseEntity);

        return mapToDTO(matchRepository.save(match));
    }

    @Transactional
    public MatchDTO rejectMatch(Long matchId) {

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found: " + matchId));

        match.setStatus("REJECTED");

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