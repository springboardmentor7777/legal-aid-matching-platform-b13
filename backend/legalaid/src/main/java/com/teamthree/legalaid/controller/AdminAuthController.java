	package com.teamthree.legalaid.controller;
	
	import com.teamthree.legalaid.service.JwtService;
	import lombok.RequiredArgsConstructor;
	import org.springframework.beans.factory.annotation.Value;
	import org.springframework.http.ResponseEntity;
	import org.springframework.web.bind.annotation.*;
	
	import java.util.Map;
	
	@RestController
	@RequestMapping("/admin")
	@RequiredArgsConstructor
	public class AdminAuthController {
	
	    @Value("${admin.username}")
	    private String adminUsername;
	
	    @Value("${admin.password}")
	    private String adminPassword;
	
	    private final JwtService jwtService;
	
	    // POST /admin/login
	    // Returns a JWT so the admin can call /admin/dashboard/** endpoints
	    @PostMapping("/login")
	    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
	
	        String username = request.get("username");
	        String password = request.get("password");
	
	        if (!adminUsername.equals(username) || !adminPassword.equals(password)) {
	            return ResponseEntity.status(401).body(Map.of(
	                "status", "error",
	                "message", "Invalid admin credentials"
	            ));
	        }
	
	        // Generate token using the admin username as the subject.
	        // The JWT filter will load this via UserDetailsService so make sure
	        // an admin user with this email/username exists in the users table,
	        // OR adjust JwtAuthenticationFilter to handle the admin subject separately.
	        String accessToken = jwtService.generateToken(adminUsername);
	
	        return ResponseEntity.ok(Map.of(
	            "status", "success",
	            "role", "ADMIN",
	            "accessToken", accessToken
	        ));
	    }
	}