package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.Case;
import com.legalmatch.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaseRepository extends JpaRepository<Case, Long> {

    Page<Case> findByUser(User user, Pageable pageable);
}