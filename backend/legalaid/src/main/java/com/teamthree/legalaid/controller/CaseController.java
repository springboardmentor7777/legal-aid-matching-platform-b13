package com.teamthree.legalaid.controller;

import com.teamthree.legalaid.dto.CreateCaseRequest;
import com.teamthree.legalaid.entity.Case;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.repository.CaseRepository;
import com.teamthree.legalaid.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
public class CaseController {

    private final CaseRepository caseRepository;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createCase(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody CreateCaseRequest request) {
        
        try {
            
            String email = principal.getUsername();
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
            
            
            Case newCase = new Case();
            newCase.setUserId(user.getId());
            newCase.setCaseTitle(request.getCaseTitle());  // For case_title column
            newCase.setTitle(request.getCaseTitle());      // For title column
            newCase.setDescription(request.getDescription());
            newCase.setCategory(request.getCategory());
            newCase.setStatus("SUBMITTED");
            
            
            Case savedCase = caseRepository.save(newCase);
            
            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Case submitted successfully");
            response.put("case", savedCase);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("status", "error");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}