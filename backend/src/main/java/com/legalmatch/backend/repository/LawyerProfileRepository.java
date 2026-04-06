package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.LawyerProfile;
import com.legalmatch.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface LawyerProfileRepository extends JpaRepository<LawyerProfile, Long> {

    // Get profile by user
    Optional<LawyerProfile> findByUser(User user);

    // Get all verified lawyers
    List<LawyerProfile> findByVerifiedTrue();

    // Get all unverified lawyers (pending verification)
    List<LawyerProfile> findByVerifiedFalseOrVerifiedIsNull();
}
