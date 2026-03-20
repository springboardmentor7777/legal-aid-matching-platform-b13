package com.teamthree.legalaid.controller;

import com.teamthree.legalaid.dto.MatchDTO;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.repository.LawyerRepository;
import com.teamthree.legalaid.repository.NgoProfileRepository;
import com.teamthree.legalaid.repository.UserRepository;
import com.teamthree.legalaid.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;
    private final UserRepository userRepository;
    private final LawyerRepository lawyerRepository;
    private final NgoProfileRepository ngoProfileRepository;

    @PostMapping("/generate/{caseId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MatchDTO>> generateMatches(@PathVariable Long caseId) {
        return ResponseEntity.ok(matchService.generateMatches(caseId));
    }


    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<MatchDTO>> getMyMatches(@AuthenticationPrincipal UserDetails principal) {
        User user = resolveUser(principal);
        return ResponseEntity.ok(matchService.getMyMatches(user));
    }


    @GetMapping("/assigned")
    @PreAuthorize("hasAnyRole('LAWYER', 'NGO')")
    public ResponseEntity<List<MatchDTO>> getAssignedMatches(@AuthenticationPrincipal UserDetails principal) {
        User user = resolveUser(principal);
        if (user.getRole().name().equals("LAWYER")) {
            return lawyerRepository.findByUser(user)
                    .map(lp -> ResponseEntity.ok(matchService.getMatchesForLawyer(lp.getId())))
                    .orElse(ResponseEntity.ok(List.of()));
        } else {
            return ngoProfileRepository.findByUser(user)
                    .map(np -> ResponseEntity.ok(matchService.getMatchesForNgo(np.getId())))
                    .orElse(ResponseEntity.ok(List.of()));
        }
    }

    @PutMapping("/{matchId}/request")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<MatchDTO> requestMatch(@PathVariable Long matchId,
            @AuthenticationPrincipal UserDetails principal) {
        User user = resolveUser(principal);
        return ResponseEntity.ok(matchService.requestMatch(matchId, user));
    }

    @PutMapping("/{matchId}/accept")
    @PreAuthorize("hasAnyRole('LAWYER', 'NGO')")
    public ResponseEntity<MatchDTO> acceptMatch(@PathVariable Long matchId,
            @AuthenticationPrincipal UserDetails principal) {
        User user = resolveUser(principal);
        return ResponseEntity.ok(matchService.acceptMatch(matchId, user));
    }

    @PutMapping("/{matchId}/reject")
    @PreAuthorize("hasAnyRole('LAWYER', 'NGO')")
    public ResponseEntity<MatchDTO> rejectMatch(@PathVariable Long matchId,
            @AuthenticationPrincipal UserDetails principal) {
        User user = resolveUser(principal);
        return ResponseEntity.ok(matchService.rejectMatch(matchId, user));
    }

    @GetMapping("/lawyer/{lawyerProfileId}")
    @PreAuthorize("hasRole('LAWYER')")
    public ResponseEntity<List<MatchDTO>> getMatchesForLawyer(@PathVariable Long lawyerProfileId) {
        return ResponseEntity.ok(matchService.getMatchesForLawyer(lawyerProfileId));
    }

    @GetMapping("/ngo/{ngoProfileId}")
    @PreAuthorize("hasRole('NGO')")
    public ResponseEntity<List<MatchDTO>> getMatchesForNgo(@PathVariable Long ngoProfileId) {
        return ResponseEntity.ok(matchService.getMatchesForNgo(ngoProfileId));
    }

    private User resolveUser(UserDetails principal) {
        return userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found: " + principal.getUsername()));
    }
}