package com.teamthree.legalaid.service;

import com.teamthree.legalaid.dto.AuthResponse;
import com.teamthree.legalaid.dto.LoginRequest;
import com.teamthree.legalaid.dto.RegisterRequest;
import com.teamthree.legalaid.entity.LawyerProfile;
import com.teamthree.legalaid.entity.NgoProfile;
import com.teamthree.legalaid.entity.Role;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.repository.LawyerRepository;
import com.teamthree.legalaid.repository.NgoProfileRepository;
import com.teamthree.legalaid.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final LawyerRepository lawyerRepository;
    private final NgoProfileRepository ngoProfileRepository;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return AuthResponse.builder()
                    .status("error")
                    .message("Email already exists")
                    .build();
        }

        User user = new User();
        user.setFullname(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setProvider("local");
        userRepository.save(user);

        // If registering as LAWYER — create LawyerProfile
        if (request.getRole() == Role.LAWYER) {
            LawyerProfile profile = new LawyerProfile();
            profile.setUser(user);
            profile.setSpecialization(request.getSpecialization());
            profile.setExpertise(request.getSpecialization());
            profile.setLocation(request.getLocation());
            profile.setExperienceYears(request.getExperienceYears());
            profile.setVerified(false);
            profile.setIsAvailable(true);
            lawyerRepository.save(profile);
        }

        // If registering as NGO — create NgoProfile
        if (request.getRole() == Role.NGO) {
            NgoProfile profile = new NgoProfile();
            profile.setUser(user);
            profile.setOrganizationName(request.getFullName());
            profile.setExpertise(request.getSpecialization());
            profile.setLocation(request.getLocation());
            profile.setVerified(false);
            profile.setIsActive(true);
            ngoProfileRepository.save(profile);
        }

        return AuthResponse.builder()
                .status("success")
                .message("User registered successfully")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
    	String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String accessToken = jwtService.generateToken(user.getEmail());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        return AuthResponse.builder()
                .status("success")
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .role(user.getRole().name())
                .userId(String.valueOf(user.getId()))
                .build();
    }
}