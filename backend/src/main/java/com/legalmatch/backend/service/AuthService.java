package com.legalmatch.backend.service;

import com.legalmatch.backend.dto.LoginRequest;
import com.legalmatch.backend.dto.RegisterRequest;
import com.legalmatch.backend.dto.AuthResponse;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.UserRepository;
import com.legalmatch.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        userRepository.save(user);

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .username(user.getUsername())
                .role(user.getRole().name())
                .onboardingComplete(user.getOnboardingComplete() != null ? user.getOnboardingComplete() : false)
                .build();
    }

    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .username(user.getUsername())
                .role(user.getRole().name())
                .onboardingComplete(user.getOnboardingComplete() != null ? user.getOnboardingComplete() : false)
                .build();
    }

    public AuthResponse refreshToken(String refreshToken) {

        String userEmail = jwtService.extractUsername(refreshToken);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow();

        UserDetails userDetails =
                org.springframework.security.core.userdetails.User
                        .builder()
                        .username(user.getEmail())
                        .password(user.getPassword())
                        .roles(user.getRole().name())
                        .build();

        if (!jwtService.isTokenValid(refreshToken, userDetails)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String newAccessToken = jwtService.generateToken(userDetails);
        String newRefreshToken = jwtService.generateRefreshToken(userDetails);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .email(user.getEmail())
                .username(user.getUsername())
                .role(user.getRole().name())
                .onboardingComplete(user.getOnboardingComplete() != null ? user.getOnboardingComplete() : false)
                .build();
    }
}
