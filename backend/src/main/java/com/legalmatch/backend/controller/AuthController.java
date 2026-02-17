package com.legalmatch.backend.controller;

import com.legalmatch.backend.dto.AuthResponse;
import com.legalmatch.backend.dto.LoginRequest;
import com.legalmatch.backend.dto.RegisterRequest;
import com.legalmatch.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
         authService.register(request);
        return "User Registered Successfully";

    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
         authService.login(request);
         return "Login Successfully";
    }
}
