package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.User;
import com.legalmatch.backend.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRole(Role role);

    List<User> findByRole(Role role);

    List<User> findBySuspendedTrue();
}
