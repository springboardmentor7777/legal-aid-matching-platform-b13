package com.teamthree.legalaid.service;

import com.teamthree.legalaid.dto.UpdateProfileRequest;
import com.teamthree.legalaid.dto.UserProfileResponse;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SystemLogService logService;
    public UserProfileResponse getProfile(User user) {
        return mapToProfileResponse(user);
    }

    public UserProfileResponse getProfileByUserId(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return mapToProfileResponse(user);
    }

    public UserProfileResponse getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return mapToProfileResponse(user);
    }

    @Transactional
    public UserProfileResponse updateProfile(User user, UpdateProfileRequest request) {
        if (request.getFullName() != null && !request.getFullName().isEmpty()) {
            user.setFullname(request.getFullName());
        }

        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            userRepository.findByEmail(request.getEmail())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(user.getId())) {
                        throw new RuntimeException("Email already in use");
                    }
                });
            user.setEmail(request.getEmail());
        }
       
        User updatedUser = userRepository.save(user);

        logService.log(
            "UPDATE",
            updatedUser.getEmail(),
            updatedUser.getRole().name(),
            "User updated profile",
            "SUCCESS"
        );

        return mapToProfileResponse(updatedUser);
    }

    @Transactional
    public void changePassword(User user, String oldPassword, String newPassword) {
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        logService.log(
        	    "UPDATE",
        	    user.getEmail(),
        	    user.getRole().name(),
        	    "User changed password",
        	    "SUCCESS"
        	);
    }

    @Transactional
    public void deleteAccount(User user) {
    	logService.log(
    		    "DELETE",
    		    user.getEmail(),
    		    user.getRole().name(),
    		    "User deleted account",
    		    "SUCCESS"
    		);
        userRepository.delete(user);
    }

    private UserProfileResponse mapToProfileResponse(User user) {
        return new UserProfileResponse(
            user.getId(),
            user.getFullname(),
            user.getEmail(),
            user.getRole().name(),   // fixed: was role.ordinal() returning 0/1/2/3
            user.getProvider(),
            user.getCreatedAt()
        );
    }
}