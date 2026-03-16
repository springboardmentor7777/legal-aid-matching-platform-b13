package com.teamthree.legalaid.controller;

import com.teamthree.legalaid.dto.MatchDTO;
import com.teamthree.legalaid.entity.User;
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

    private User resolveUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ADMIN — generate matches for a case
    @PostMapping("/generate/{caseId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MatchDTO>> generateMatches(@PathVariable Long caseId) {
        return ResponseEntity.ok(matchService.generateMatches(caseId));
    }

    // ALL roles — get my matches
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'LAWYER', 'NGO')")
    public ResponseEntity<List<MatchDTO>> getMyMatches(@AuthenticationPrincipal UserDetails userDetails) {
        User user = resolveUser(userDetails);
        String role = user.getRole().name();
        if (role.equals("LAWYER")) {
            return ResponseEntity.ok(matchService.getMatchesForLawyerUser(user));
        } else if (role.equals("NGO")) {
            return ResponseEntity.ok(matchService.getMatchesForNgoUser(user));
        } else {
            return ResponseEntity.ok(matchService.getMyMatches(user));
        }
    }

    // USER — send request to lawyer/NGO
    @PutMapping("/{matchId}/request")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<MatchDTO> requestMatch(
            @PathVariable Long matchId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = resolveUser(userDetails);
        return ResponseEntity.ok(matchService.requestMatch(matchId, user));
    }

    // LAWYER/NGO — accept a requested match
    @PutMapping("/{matchId}/accept")
    @PreAuthorize("hasAnyRole('LAWYER', 'NGO')")
    public ResponseEntity<MatchDTO> acceptMatch(@PathVariable Long matchId) {
        return ResponseEntity.ok(matchService.acceptMatch(matchId));
    }

    // LAWYER/NGO — reject a requested match
    @PutMapping("/{matchId}/reject")
    @PreAuthorize("hasAnyRole('LAWYER', 'NGO')")
    public ResponseEntity<MatchDTO> rejectMatch(@PathVariable Long matchId) {
        return ResponseEntity.ok(matchService.rejectMatch(matchId));
    }
}