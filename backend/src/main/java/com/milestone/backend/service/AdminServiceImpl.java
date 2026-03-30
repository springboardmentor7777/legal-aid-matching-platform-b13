package com.milestone.backend.service;

import com.milestone.backend.dto.*;
import com.milestone.backend.entity.*;
import com.milestone.backend.repository.*;
import com.milestone.backend.service.AdminService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final CaseRepository caseRepository;
    private final SystemLogRepository logRepository;

    // 🔹 1. Get all users
    @Override
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponseDto(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getIsVerified(),
                        user.getEnabled()   // ✅ important
                ))
                .collect(Collectors.toList());
    }

    // 🔹 2. Enable / Disable User
    @Override
    public void updateUserStatus(Long id, StatusUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEnabled(request.getEnabled());
        userRepository.save(user);
    }

    // 🔹 3. Pending Verifications
    @Override
    public List<VerificationDto> getPendingVerifications() {
        return userRepository.findByIsVerifiedFalse()
                .stream()
                .map(user -> new VerificationDto(
                        user.getId(),
                        user.getName(),
                        user.getRole(),
                        user.getIsVerified()
                ))
                .collect(Collectors.toList());
    }

    // 🔹 4. Verify Lawyer
    @Override
    public void verifyLawyer(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.LAWYER) {
            throw new RuntimeException("User is not a lawyer");
        }

        user.setIsVerified(true);
        userRepository.save(user);
    }

    // 🔹 5. Verify NGO
    @Override
    public void verifyNgo(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.NGO) {
            throw new RuntimeException("User is not an NGO");
        }

        user.setIsVerified(true);
        userRepository.save(user);
    }

    // 🔹 6. Get all cases (IMPORTANT FIX)
   @Override
public List<CaseResponse> getAllCases() {
    return caseRepository.findAll()
            .stream()
            .map(c -> new CaseResponse(
                    c.getUser() != null ? c.getUser().getName() : null,
                    c.getId(),
                    c.getTitle(),
                    c.getDescription(),
                    c.getCategory(),
                    c.getStatus(),
                    c.getCreatedAt(),
                    c.getUpdatedAt(),
                    c.getLocation(),
                    c.getIncidentDate(),
                    c.getIncidentTime(),
                    c.getAdditionalNotes(),
                    c.getContactInfo(),
                    c.getAttachment(),
                    c.getPersonName(),
                    c.getCustomCategory(),
                    c.getSubcategory(),
                    c.getCurrentStatus(),
                    c.getFirNumber(),
                    c.getFirFile(),
                    c.getOtherLocation(),
                    c.getOtherRepresentative(),
                    c.getLegalDocuments()
            ))
            .toList();   // ✅ THIS FIXES YOUR ERROR
}
    // 🔹 7. System Logs
    @Override
    public List<SystemLogDto> getSystemLogs() {
        return logRepository.findAll()
                .stream()
                .map(log -> new SystemLogDto(
                        log.getTimestamp().toString(),
                        log.getLevel(),   // ✅ your entity uses String
                        log.getMessage()
                ))
                .collect(Collectors.toList());
    }

    // 🔹 8. System Health
    @Override
    public SystemHealthDto getSystemHealth() {
        return new SystemHealthDto(
                "UP",
                "CONNECTED",
                "RUNNING"
        );
    }
}