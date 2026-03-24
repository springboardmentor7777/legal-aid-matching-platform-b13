package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.NGOProfile;
import com.legalmatch.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface NGOProfileRepository extends JpaRepository<NGOProfile, Long> {

    // Get NGO profile by user
    Optional<NGOProfile> findByUser(User user);

    // Get all verified NGOs
    List<NGOProfile> findByVerifiedTrue();
}