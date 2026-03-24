package com.milestone.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.milestone.backend.entity.Case;
import com.milestone.backend.entity.CaseStatus;

@Repository
public interface CaseRepository extends JpaRepository<Case, Long> {

    List<Case> findByUserId(Long userId);

    List<Case> findByCategory(String category);

    List<Case> findByLocation(String location);

    List<Case> findByStatus(CaseStatus status);

    List<Case> findByAssignedLawyerIdAndStatus(Long lawyerId, CaseStatus status);

    List<Case> findByRequestedLawyerIdAndStatus(Long lawyerId, CaseStatus status);
}
