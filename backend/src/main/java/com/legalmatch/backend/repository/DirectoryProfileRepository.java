package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.DirectoryProfile;
import com.legalmatch.backend.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DirectoryProfileRepository extends JpaRepository<DirectoryProfile, Long> {

    Page<DirectoryProfile> findByUser_RoleAndVerifiedTrue(
            Role role,
            Pageable pageable
    );

    Page<DirectoryProfile> findByUser_RoleAndExpertiseContainingIgnoreCaseAndLocationContainingIgnoreCaseAndVerified(
            Role role,
            String expertise,
            String location,
            boolean verified,
            Pageable pageable
    );

}