package com.milestone.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.milestone.backend.entity.Case;
import com.milestone.backend.entity.CaseStatus;

@Repository
public interface CaseRepository extends JpaRepository<Case, Long> {

    List<Case> findByUserId(Long userId);

    List<Case> findByCategory(String category);

    List<Case> findByLocation(String location);

    List<Case> findByStatus(CaseStatus status);

    //  NEW METHOD ADDED FOR ANALYTICS DASHBOARD 
    long countByStatus(CaseStatus status);

    List<Case> findByAssignedLawyerIdAndStatus(Long lawyerId, CaseStatus status);

    List<Case> findByRequestedLawyerIdAndStatus(Long lawyerId, CaseStatus status);

    //  NEW: Group cases by category for the Admin Bar Chart 
    @Query("SELECT new com.milestone.backend.dto.CategoryCountDto(c.category, COUNT(c)) FROM Case c GROUP BY c.category")
    List<com.milestone.backend.dto.CategoryCountDto> countCasesByCategory();

    //  NEW: Group cases by location for the Geographic Map 
    @Query("SELECT new com.milestone.backend.dto.LocationCountDto(c.location, COUNT(c)) FROM Case c GROUP BY c.location")
    List<com.milestone.backend.dto.LocationCountDto> countCasesByLocation();
}