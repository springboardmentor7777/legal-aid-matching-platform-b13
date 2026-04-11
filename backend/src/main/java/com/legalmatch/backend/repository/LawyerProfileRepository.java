package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.LawyerProfile;
import com.legalmatch.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface LawyerProfileRepository extends JpaRepository<LawyerProfile, Long> {

    Optional<LawyerProfile> findByUser(User user);

    List<LawyerProfile> findByVerifiedTrue();

    List<LawyerProfile> findByVerifiedFalseOrVerifiedIsNull();

    Page<LawyerProfile> findByExpertiseContainingIgnoreCaseAndLocationContainingIgnoreCase(
            String expertise, String location, Pageable pageable);

    Page<LawyerProfile> findByExpertiseContainingIgnoreCaseAndLocationContainingIgnoreCaseAndVerifiedTrue(
            String expertise, String location, Pageable pageable);

    Page<LawyerProfile> findAll(Pageable pageable);
}
