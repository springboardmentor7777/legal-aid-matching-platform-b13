package com.teamthree.legalaid.repository;

import com.teamthree.legalaid.entity.Case;
import com.teamthree.legalaid.entity.User;
import com.teamthree.legalaid.entity.NgoProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CaseRepository extends JpaRepository<Case, Long> {
    
    // Count methods
    Long countByStatus(String status);
    
    Long countByClient(User client);
    
    Long countByClientAndStatus(User client, String status);
    
    Long countByAssignedToAndStatus(User assignedTo, String status);
    
    Long countByNgo(NgoProfile ngo);
    
    Long countByNgoAndStatus(NgoProfile ngo, String status);
    
    @Query("SELECT COUNT(DISTINCT c.assignedTo) FROM Case c WHERE c.ngo = :ngo")
    Long countDistinctLawyersByNgo(@Param("ngo") NgoProfile ngo);
    
    // Find methods - Top/Recent
    List<Case> findTop10ByOrderByFiledDateDesc();
    
    List<Case> findTop5ByClientOrderByFiledDateDesc(User client);
    
    List<Case> findTop5ByAssignedToOrderByFiledDateDesc(User assignedTo);
    
    // Find by Client
    List<Case> findByClientOrderByFiledDateDesc(User client);
    
    List<Case> findByClientAndStatusIn(User client, List<String> statuses);
    
    List<Case> findByClientAndStatus(User client, String status);
    
    Optional<Case> findFirstByClientOrderByFiledDateDesc(User client);
    
    // Find by Assigned To (Lawyer)
    List<Case> findByAssignedToOrderByFiledDateDesc(User assignedTo);
    
    List<Case> findByAssignedToAndStatusOrderByFiledDateDesc(User assignedTo, String status);
    
    List<Case> findByAssignedToAndHearingDateBetween(User assignedTo, LocalDateTime start, LocalDateTime end);
    
    // Find by NGO
    List<Case> findByNgoOrderByFiledDateDesc(NgoProfile ngo);
    
    List<Case> findByNgoAndStatus(NgoProfile ngo, String status);
    
    List<Case> findByNgoAndHearingDateAfterOrderByHearingDateAsc(NgoProfile ngo, LocalDateTime date);
    
    // Recent Activities Queries - Fixed to return Object[] with proper order
    @Query("SELECT c.id, 'CASE_UPDATE', CONCAT('Case ', c.caseTitle, ' was updated'), c.updatedAt, c.client.fullname " +
           "FROM Case c WHERE c.client = :user ORDER BY c.updatedAt DESC")
    List<Object[]> findRecentActivitiesByUser(@Param("user") User user);
    
    @Query("SELECT c.id, 'CASE_UPDATE', CONCAT('Case ', c.caseTitle, ' was updated'), c.updatedAt, c.client.fullname " +
           "FROM Case c ORDER BY c.updatedAt DESC")
    List<Object[]> findRecentActivities();
}