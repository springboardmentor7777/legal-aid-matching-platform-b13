package com.legalmatch.backend.controller;

import com.legalmatch.backend.dto.AuthResponse;
import com.legalmatch.backend.dto.LoginRequest;
import com.legalmatch.backend.dto.RefreshTokenRequest;
import com.legalmatch.backend.dto.RegisterRequest;
import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.UserRepository;
import com.legalmatch.backend.security.JwtService;
import com.legalmatch.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
         authService.register(request);
        return "User Registered Successfully";

    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
    @PostMapping("/refresh-token")
    public AuthResponse refreshToken(@RequestBody RefreshTokenRequest request) {
        return authService.refreshToken(request.getRefreshToken());
    }


}
