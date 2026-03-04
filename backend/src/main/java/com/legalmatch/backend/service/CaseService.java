package com.legalmatch.backend.service;

import com.legalmatch.backend.dto.CaseResponse;
import com.legalmatch.backend.dto.CreateCaseRequest;
import com.legalmatch.backend.entity.Case;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.CaseRepository;
import com.legalmatch.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CaseService {

    private final CaseRepository caseRepository;
    private final UserRepository userRepository;



    public CaseResponse createCase(CreateCaseRequest request, String username) {

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getRole().name().equals("CITIZEN")) {
            throw new RuntimeException("Only citizens can create cases");
        }

        Case newCase = Case.builder()
                .user(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .build();

        Case saved = caseRepository.save(newCase);

        return CaseResponse.builder()
                .id(saved.getId())
                .title(saved.getTitle())
                .description(saved.getDescription())
                .category(saved.getCategory())
                .status(saved.getStatus().name())
                .createdAt(saved.getCreatedAt())
                .updatedAt(saved.getUpdatedAt())
                .build();
    }
    public List<CaseResponse> getMyCases(String username) {

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Case> cases = caseRepository.findByUser(user);

        return cases.stream()
                .map(c -> CaseResponse.builder()
                        .id(c.getId())
                        .title(c.getTitle())
                        .description(c.getDescription())
                        .category(c.getCategory())
                        .status(c.getStatus().name())
                        .createdAt(c.getCreatedAt())
                        .updatedAt(c.getUpdatedAt())
                        .build())
                .toList();
    }
    public CaseResponse getCaseById(Long id) {

        Case c = caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        return CaseResponse.builder()
                .id(c.getId())
                .title(c.getTitle())
                .description(c.getDescription())
                .category(c.getCategory())
                .status(c.getStatus().name())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}