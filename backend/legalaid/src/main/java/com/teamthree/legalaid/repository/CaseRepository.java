package com.teamthree.legalaid.repository;

import com.teamthree.legalaid.entity.Case;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CaseRepository extends JpaRepository<Case, Long> {
    
    // Find all cases by user ID
    List<Case> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Paginated version
    Page<Case> findByUserId(Long userId, Pageable pageable);
    
    // Find cases by status
    List<Case> findByStatus(String status);
    
    // Find cases by category
    List<Case> findByCategory(String category);
    
    // Find cases by user ID and status
    List<Case> findByUserIdAndStatus(Long userId, String status);
    
    // SEARCH CASES - FIXED: use caseTitle instead of title
    @Query("SELECT c FROM Case c WHERE " +
           "LOWER(c.caseTitle) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +  // CHANGED: title -> caseTitle
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Case> searchCases(@Param("keyword") String keyword);
    
    // Filter cases with multiple criteria
    @Query("SELECT c FROM Case c WHERE " +
           "(:userId IS NULL OR c.userId = :userId) AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:category IS NULL OR c.category = :category)")
    List<Case> filterCases(
            @Param("userId") Long userId,
            @Param("status") String status,
            @Param("category") String category);
    
    // Count cases by user
    Long countByUserId(Long userId);
    
    // Count cases by status
    Long countByStatus(String status);
    
    // Count cases by category
    Long countByCategory(String category);
    
    // Get recent cases
    @Query("SELECT c FROM Case c ORDER BY c.createdAt DESC")
    List<Case> findRecentCases(Pageable pageable);
    
    // Check if case exists and belongs to user
    boolean existsByIdAndUserId(Long id, Long userId);
}