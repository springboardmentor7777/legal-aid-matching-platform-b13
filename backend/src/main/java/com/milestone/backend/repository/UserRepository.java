package com.milestone.backend.repository;

import java.util.Optional;
import java.util.List; // Added this import

import org.springframework.data.jpa.repository.JpaRepository;

import com.milestone.backend.entity.User;
import com.milestone.backend.entity.Role; // Added this import

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);

    // Added this method to fetch users by their role (LAWYER, NGO, etc.)
    List<User> findAllByRole(Role role);
}