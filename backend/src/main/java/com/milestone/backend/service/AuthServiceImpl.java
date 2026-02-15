package com.milestone.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.milestone.backend.dto.AuthResponse;
import com.milestone.backend.dto.LoginRequest;
import com.milestone.backend.dto.RefreshTokenRequest;
import com.milestone.backend.dto.RegisterRequest;
import com.milestone.backend.security.JwtUtil;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

   @Override
public AuthResponse refreshToken(RefreshTokenRequest request) {

    String email = jwtUtil.extractUsername(request.getRefreshToken());

    UserDetails userDetails =
            userDetailsService.loadUserByUsername(email);

    if (!jwtUtil.validateToken(request.getRefreshToken())) {
        throw new RuntimeException("Invalid refresh token");
    }

    String newAccessToken =
            jwtUtil.generateToken(userDetails.getUsername());

    return new AuthResponse(
            newAccessToken,
            request.getRefreshToken(),
            userDetails.getUsername(),
            userDetails.getAuthorities().toString()
    );
}

    @Override
public AuthResponse register(RegisterRequest request) {
    return null; // temporary if already written elsewhere
}

@Override
public AuthResponse login(LoginRequest request) {
    return null; // temporary
}

    // keep your existing register() and login() implementations here
}
