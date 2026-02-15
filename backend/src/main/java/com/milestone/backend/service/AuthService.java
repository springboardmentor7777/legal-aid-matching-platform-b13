package com.milestone.backend.service;

import com.milestone.backend.dto.AuthResponse;
import com.milestone.backend.dto.LoginRequest;
import com.milestone.backend.dto.RefreshTokenRequest;
import com.milestone.backend.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);
}
