package com.example.legalmatchpro.controller;

import com.example.legalmatchpro.dto.AuthResponse;
import com.example.legalmatchpro.dto.LoginRequest;
import com.example.legalmatchpro.dto.RegisterRequest;
import com.example.legalmatchpro.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
