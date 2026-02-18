package com.teamthree.legalaid.controller;

<<<<<<< HEAD
import com.teamthree.legalaid.dto.LoginRequest;
import com.teamthree.legalaid.dto.RegisterRequest;
import com.teamthree.legalaid.service.AuthService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest request) {
        return authService.login(request);
=======
import com.teamthree.legalaid.dto.AuthResponse;
import com.teamthree.legalaid.dto.LoginRequest;
import com.teamthree.legalaid.dto.RegisterRequest;
import com.teamthree.legalaid.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
>>>>>>> branch 'team-three' of https://github.com/springboardmentor7777/legal-aid-matching-platform-b13.git
    }
}
