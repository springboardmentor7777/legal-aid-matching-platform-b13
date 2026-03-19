package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.Case;
import com.legalmatch.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CaseRepository extends JpaRepository<Case, Long> {

    Page<Case> findByUser(User user, Pageable pageable);

    List<Case> findByUserOrderByCreatedAtDesc(User user);

    List<Case> findByUser(User user);

    long countByUserAndStatusIn(User user, java.util.Collection<com.legalmatch.backend.entity.CaseStatus> statuses);
}