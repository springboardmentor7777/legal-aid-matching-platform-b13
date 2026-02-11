package com.example.legalmatchpro.service;

import com.example.legalmatchpro.dto.AuthResponse;
import com.example.legalmatchpro.dto.LoginRequest;
import com.example.legalmatchpro.dto.RegisterRequest;
import com.example.legalmatchpro.entity.User;
import com.example.legalmatchpro.repository.UserRepository;
import com.example.legalmatchpro.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .enabled(true)
                .build();

        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user.getEmail());

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .tokenType("Bearer")
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

        String jwtToken = jwtService.generateToken(user.getEmail());

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .tokenType("Bearer")
                .build();
    }
}
