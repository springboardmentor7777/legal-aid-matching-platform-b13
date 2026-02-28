package com.milestone.backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.milestone.backend.entity.Case;




public interface CaseRepository extends JpaRepository<Case, Long> {
    List<Case> findByUserId(Long userId);
}