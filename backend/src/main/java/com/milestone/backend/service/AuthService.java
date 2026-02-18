package com.milestone.backend.service;

import com.milestone.backend.dto.AuthResponse;
import com.milestone.backend.dto.LoginRequest;
import com.milestone.backend.dto.RefreshTokenRequest;
import com.milestone.backend.dto.RegisterRequest;
import com.milestone.backend.dto.RegistrationResponse;

public interface AuthService {

    RegistrationResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);
}
