package com.teamthree.legalaid.service;

import com.teamthree.legalaid.dto.LoginRequest;
import com.teamthree.legalaid.dto.RegisterRequest;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public Map<String, String> register(RegisterRequest request) {
        Map<String, String> response = new HashMap<>();

        if (userRepository.existsByEmail(request.getEmail())) {
            response.put("status", "error");
            response.put("message", "Email already exists");
            return response;
        }

        User user = new User();
        user.setFullname(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setProvider("local");

        userRepository.save(user);

        response.put("status", "success");
        response.put("message", "User registered successfully");
        return response;
    }

    public Map<String, String> login(LoginRequest request) {
        Map<String, String> response = new HashMap<>();

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String accessToken = jwtService.generateToken(user.getEmail());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        response.put("status", "success");
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);
        response.put("role", user.getRole().name());
        response.put("userId", String.valueOf(user.getId()));
        
        return response;
    }

    public Map<String, String> refreshToken(String refreshToken) {
        Map<String, String> response = new HashMap<>();
        
        try {
            String username = jwtService.extractUsername(refreshToken);
            
            if (jwtService.validateToken(refreshToken)) {
                User user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
                
                String newAccessToken = jwtService.generateToken(user.getEmail());
                
                response.put("status", "success");
                response.put("accessToken", newAccessToken);
                response.put("refreshToken", refreshToken); 
            } else {
                response.put("status", "error");
                response.put("message", "Invalid refresh token");
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Token refresh failed");
        }
        
        return response;
    }
}