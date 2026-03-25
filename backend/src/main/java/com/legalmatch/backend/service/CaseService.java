package com.legalmatch.backend.service;

import com.legalmatch.backend.dto.CaseResponse;
import com.legalmatch.backend.dto.CreateCaseRequest;
import com.legalmatch.backend.entity.Case;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.CaseRepository;
import com.legalmatch.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CaseService {

    private final CaseRepository caseRepository;
    private final UserRepository userRepository;

    // ✅ CREATE CASE
    public CaseResponse createCase(CreateCaseRequest request, String username) {

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ FIXED ROLE CHECK (IMPORTANT)
        if (!user.getRole().name().equals("ROLE_CITIZEN")) {
            throw new RuntimeException("Only citizens can create cases");
        }

        Case newCase = Case.builder()
                .user(user)
                .caseType(request.getCaseType())
                .description(request.getDescription())
                .urgency(request.getUrgency() != null ? request.getUrgency() : "MEDIUM")
                .location(request.getLocation())
                .build();

        Case saved = caseRepository.save(newCase);

        return mapToResponse(saved);
    }

    // ✅ GET USER CASES
    public List<CaseResponse> getMyCases(String username) {

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Case> cases = caseRepository.findByUserOrderByCreatedAtDesc(user);

        return cases.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ✅ GET CASE BY ID
    public CaseResponse getCaseById(Long id) {

        Case c = caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        return mapToResponse(c);
    }

    // ✅ INTERNAL USE
    public Case getCaseEntityById(Long id) {
        return caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found"));
    }

    public Case save(Case legalCase) {
        return caseRepository.save(legalCase);
    }

    // ✅ MAPPER
    private CaseResponse mapToResponse(Case c) {
        return CaseResponse.builder()
                .id(c.getId())
                .caseType(c.getCaseType())
                .description(c.getDescription())
                .urgency(c.getUrgency())
                .location(c.getLocation())
                .status(c.getStatus().name())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}