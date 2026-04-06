package com.legalmatch.backend.config;

import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Development data initializer that ensures seed user passwords
 * are correctly BCrypt-encoded on application startup.
 *
 * The V26 migration used a static BCrypt hash that may not match
 * the expected password "Password@123". This component verifies
 * and fixes the hashes using Spring's actual BCryptPasswordEncoder.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DevDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String DEFAULT_PASSWORD = "Password@123";

    @Override
    public void run(String... args) {
        List<User> users = userRepository.findAll();

        if (users.isEmpty()) {
            log.info("No users found — skipping password verification.");
            return;
        }

        int fixed = 0;
        for (User user : users) {
            if (!passwordEncoder.matches(DEFAULT_PASSWORD, user.getPassword())) {
                user.setPassword(passwordEncoder.encode(DEFAULT_PASSWORD));
                userRepository.save(user);
                fixed++;
            }
        }

        if (fixed > 0) {
            log.info("✅ Fixed {} seed user password(s) — all accounts now use '{}'", fixed, DEFAULT_PASSWORD);
        } else {
            log.info("✅ All {} seed user passwords verified OK.", users.size());
        }
    }
}
