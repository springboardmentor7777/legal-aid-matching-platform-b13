package com.milestone.backend.service;

import com.milestone.backend.dto.*;

import java.util.List;

public interface AdminService {

    List<UserResponseDto> getAllUsers();

    void updateUserStatus(Long id, StatusUpdateRequest request);

    List<VerificationDto> getPendingVerifications();

    void verifyLawyer(Long id);

    void verifyNgo(Long id);

    List<CaseResponse> getAllCases();

    List<SystemLogDto> getSystemLogs();

    SystemHealthDto getSystemHealth();
}