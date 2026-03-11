
package com.teamthree.legalaid.controller;

import com.teamthree.legalaid.dto.MatchDTO;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    
    @PostMapping("/generate/{caseId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MatchDTO>> generateMatches(@PathVariable Long caseId) {
        return ResponseEntity.ok(matchService.generateMatches(caseId));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<MatchDTO>> getMyMatches(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(matchService.getMyMatches(user));
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

}

