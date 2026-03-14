package com.milestone.backend.service;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.milestone.backend.dto.AuthResponse;
import com.milestone.backend.dto.LoginRequest;
import com.milestone.backend.dto.RefreshTokenRequest;
import com.milestone.backend.dto.RegisterRequest;
import com.milestone.backend.dto.RegistrationResponse;
import com.milestone.backend.entity.User;
import com.milestone.backend.repository.UserRepository;
import com.milestone.backend.security.JwtUtil;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    // private final LocalDateTime time;

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {

        String email = jwtUtil.extractUsername(request.getRefreshToken());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!jwtUtil.validateToken(request.getRefreshToken())) {
            throw new RuntimeException("Invalid refresh token");
        }

        String newAccessToken = jwtUtil.generateToken(user.getEmail());

        // Fix: We use the Builder and ensure the role is converted correctly if needed
        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(request.getRefreshToken())
                .username(user.getEmail()) // Changed from userDetails to user.getEmail()
                .role(user.getRole()) // Passing the Role object directly
                .message("Token refreshed successfully")
                .build();
    }

    @Override
    public RegistrationResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with this email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setTime_stamp(LocalDateTime.now());
        userRepository.save(user);

        RegistrationResponse response = new RegistrationResponse();
        response.setMessage("registered successfully");
        return response;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Generate tokens
        String accessToken = jwtUtil.generateToken(user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user);

        // Return response with both tokens
        // return new AuthResponse(
        // accessToken,
        // "Login successful",
        // accessToken,
        // refreshToken,
        // user.getRole(),
        // user.getUsername()
        // );
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .message("Login successful")
                .role(user.getRole())
                .username(user.getName())
                .email(user.getEmail()) // <-- Explicitly added the email
                .isVerified(user.getIsVerified())
                .build();
    }

    // keep your existing register() and login() implementations here
}
