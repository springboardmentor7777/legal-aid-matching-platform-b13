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

    /**
     * Returns profile for an already-resolved User entity.
     * Used by GET /profile/me after the controller extracts User from CustomUserDetails.
     */
    public UserProfileResponse getProfile(User user) {
        return mapToProfileResponse(user);
    }

    /**
     * Looks up a user by their database ID and returns their profile.
     */
    public UserProfileResponse getProfileByUserId(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return mapToProfileResponse(user);
    }

    /**
     * Looks up a user by email and returns their profile.
     * Kept for any internal callers; not exposed via the controller.
     */
    public UserProfileResponse getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return mapToProfileResponse(user);
    }

    /**
     * Updates a user's profile fields.
     *
     * Only non-null, non-empty fields in the request are applied, so a partial
     * update (e.g. only changing fullName) works correctly.
     *
     * NOTE: The user entity passed in here comes from CustomUserDetails.getUser()
     * (a detached JPA entity). We fetch a fresh managed copy from the DB before
     * saving to avoid accidental overwrites of fields not included in the request.
     */
    @Transactional
    public UserProfileResponse updateProfile(User user, UpdateProfileRequest request) {
        // Re-fetch the managed entity so Hibernate tracks changes properly
        User managedUser = userRepository.findById(user.getId())
            .orElseThrow(() -> new RuntimeException("User not found with id: " + user.getId()));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            managedUser.setFullname(request.getFullName());
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            // Make sure no other account owns the requested email
            userRepository.findByEmail(request.getEmail()).ifPresent(existing -> {
                if (!existing.getId().equals(managedUser.getId())) {
                    throw new RuntimeException("Email already in use by another account");
                }
            });
            managedUser.setEmail(request.getEmail());
        }

        User saved = userRepository.save(managedUser);

        logService.log(
            "UPDATE",
            saved.getEmail(),
            saved.getRole().name(),
            "User updated profile",
            "SUCCESS"
        );

        return mapToProfileResponse(saved);
    }

    /**
     * Changes the password for the given user after verifying the old one.
     */
    @Transactional
    public void changePassword(User user, String oldPassword, String newPassword) {
        // Re-fetch managed entity
        User managedUser = userRepository.findById(user.getId())
            .orElseThrow(() -> new RuntimeException("User not found with id: " + user.getId()));

        if (!passwordEncoder.matches(oldPassword, managedUser.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        if (newPassword == null || newPassword.length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters");
        }

        managedUser.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(managedUser);

        logService.log(
            "UPDATE",
            managedUser.getEmail(),
            managedUser.getRole().name(),
            "User changed password",
            "SUCCESS"
        );
    }

    /**
     * Permanently deletes the account.
     */
    @Transactional
    public void deleteAccount(User user) {
        User managedUser = userRepository.findById(user.getId())
            .orElseThrow(() -> new RuntimeException("User not found with id: " + user.getId()));

        logService.log(
            "DELETE",
            managedUser.getEmail(),
            managedUser.getRole().name(),
            "User deleted account",
            "SUCCESS"
        );

        userRepository.delete(managedUser);
    }

    // ── private helpers ────────────────────────────────────────────────────────

    private UserProfileResponse mapToProfileResponse(User user) {
        return new UserProfileResponse(
            user.getId(),
            user.getFullname(),
            user.getEmail(),
            user.getRole().name(),   // "USER", "LAWYER", "NGO", "ADMIN"
            user.getProvider(),
            user.getCreatedAt()
        );
    }
}
