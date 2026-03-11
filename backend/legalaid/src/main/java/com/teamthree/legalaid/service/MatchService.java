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
        Case case_ = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found: " + caseId));

        List<Match> newMatches = new ArrayList<>();

     
        List<LawyerProfile> lawyers = lawyerRepository.findAll();
        for (LawyerProfile lawyer : lawyers) {
          
            if (matchRepository.existsByCase_AndProfileIdAndProfileType(case_, lawyer.getId(), "LAWYER")) {
                continue;
            }
            int score = calculateLawyerScore(case_, lawyer);
            if (score > 0) {
                Match match = Match.builder()
                        .case_(case_)
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
            if (matchRepository.existsByCase_AndProfileIdAndProfileType(case_, ngo.getId(), "NGO")) {
                continue;
            }
            int score = calculateNgoScore(case_, ngo);
            if (score > 0) {
                Match match = Match.builder()
                        .case_(case_)
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
        return saved.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

   
    public List<MatchDTO> getMyMatches(User user) {
        List<Case> userCases = caseRepository.findByClientOrderByFiledDateDesc(user);
        List<Match> allMatches = new ArrayList<>();
        for (Case c : userCases) {
            allMatches.addAll(matchRepository.findByCase_OrderByMatchScoreDesc(c));
        }
        return allMatches.stream().map(this::mapToDTO).collect(Collectors.toList());
    }


    public List<MatchDTO> getMatchesForLawyer(Long lawyerProfileId) {
        return matchRepository.findByProfileIdAndProfileType(lawyerProfileId, "LAWYER")
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }


    public List<MatchDTO> getMatchesForNgo(Long ngoProfileId) {
        return matchRepository.findByProfileIdAndProfileType(ngoProfileId, "NGO")
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

 
    @Transactional
    public MatchDTO acceptMatch(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found: " + matchId));
        match.setStatus("ACCEPTED");


        Case case_ = match.getCase_();
        case_.setStatus("ACTIVE");
        caseRepository.save(case_);

        return mapToDTO(matchRepository.save(match));
    }


    @Transactional
    public MatchDTO rejectMatch(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found: " + matchId));
        match.setStatus("REJECTED");
        return mapToDTO(matchRepository.save(match));
    }

    private int calculateLawyerScore(Case case_, LawyerProfile lawyer) {
        int score = 0;


        if (lawyer.getExpertise() != null && case_.getCategory() != null) {
            if (lawyer.getExpertise().toLowerCase().contains(case_.getCategory().toLowerCase()) ||
                case_.getCategory().toLowerCase().contains(lawyer.getExpertise().toLowerCase())) {
                score += 40;
            }
        }


        if (lawyer.getLocation() != null && case_.getLocation() != null) {
            if (lawyer.getLocation().toLowerCase().contains(case_.getLocation().toLowerCase()) ||
                case_.getLocation().toLowerCase().contains(lawyer.getLocation().toLowerCase())) {
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

    private int calculateNgoScore(Case case_, NgoProfile ngo) {
        int score = 0;

        // Expertise matches category (+40)
        if (ngo.getExpertise() != null && case_.getCategory() != null) {
            if (ngo.getExpertise().toLowerCase().contains(case_.getCategory().toLowerCase()) ||
                case_.getCategory().toLowerCase().contains(ngo.getExpertise().toLowerCase())) {
                score += 40;
            }
        }

    
        if (ngo.getLocation() != null && case_.getLocation() != null) {
            if (ngo.getLocation().toLowerCase().contains(case_.getLocation().toLowerCase()) ||
                case_.getLocation().toLowerCase().contains(ngo.getLocation().toLowerCase())) {
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

        if (match.getCase_() != null) {
            dto.setCaseId(match.getCase_().getId());
            dto.setCaseTitle(match.getCase_().getCaseTitle());
            dto.setCaseCategory(match.getCase_().getCategory());
            dto.setCaseLocation(match.getCase_().getLocation());
        }

        if ("LAWYER".equals(match.getProfileType())) {
            lawyerRepository.findById(match.getProfileId()).ifPresent(lawyer -> {
                dto.setProfileName(lawyer.getUser() != null ? lawyer.getUser().getFullname() : "Unknown");
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