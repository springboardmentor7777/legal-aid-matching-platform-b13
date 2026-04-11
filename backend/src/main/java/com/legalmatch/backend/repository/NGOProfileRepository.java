package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.NGOProfile;
import com.legalmatch.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface NGOProfileRepository extends JpaRepository<NGOProfile, Long> {

    Optional<NGOProfile> findByUser(User user);

    List<NGOProfile> findByVerifiedTrue();

    List<NGOProfile> findByVerifiedFalseOrVerifiedIsNull();

    Page<NGOProfile> findByFocusAreaContainingIgnoreCaseAndLocationContainingIgnoreCase(
            String focusArea, String location, Pageable pageable);

    Page<NGOProfile> findByFocusAreaContainingIgnoreCaseAndLocationContainingIgnoreCaseAndVerifiedTrue(
            String focusArea, String location, Pageable pageable);

    Page<NGOProfile> findAll(Pageable pageable);
}