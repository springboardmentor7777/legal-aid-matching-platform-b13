package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.Case;
import com.legalmatch.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CaseRepository extends JpaRepository<Case, Long> {

    List<Case> findByUser(User user);
}