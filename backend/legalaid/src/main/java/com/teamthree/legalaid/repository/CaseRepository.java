package com.teamthree.legalaid.repository;

import com.teamthree.legalaid.entity.Case;
import com.teamthree.legalaid.entity.NgoProfile;
import com.teamthree.legalaid.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CaseRepository extends JpaRepository<Case, Long> {


    long countByStatus(String status);
    long countByAssignedToAndStatus(User assignedTo, String status);
    long countByClient(User client);
    long countByClientAndStatus(User client, String status);
    long countByClientAndStatusIn(User client, List<String> statuses);
    long countByNgo(NgoProfile ngo);
    long countByNgoAndStatus(NgoProfile ngo, String status);

    @Query("SELECT COUNT(DISTINCT c.assignedTo) FROM Case c WHERE c.ngo = :ngo")
    long countDistinctLawyersByNgo(@Param("ngo") NgoProfile ngo);


    List<Case> findByAssignedToAndStatusOrderByFiledDateDesc(User assignedTo, String status);
    List<Case> findByAssignedToAndHearingDateBetween(User assignedTo, LocalDateTime start, LocalDateTime end);
    List<Case> findTop5ByAssignedToOrderByFiledDateDesc(User assignedTo);


    List<Case> findByClientOrderByFiledDateDesc(User client);
    List<Case> findByClientAndStatusIn(User client, List<String> statuses);
    List<Case> findByClientAndStatus(User client, String status);
    List<Case> findTop5ByClientOrderByFiledDateDesc(User client);
    Optional<Case> findFirstByClientOrderByFiledDateDesc(User client);


    List<Case> findByNgoOrderByFiledDateDesc(NgoProfile ngo);
    List<Case> findByNgoAndStatus(NgoProfile ngo, String status);
    List<Case> findByNgoAndHearingDateAfterOrderByHearingDateAsc(NgoProfile ngo, LocalDateTime date);


    List<Case> findTop10ByOrderByFiledDateDesc();


    @Query(value = "SELECT c.id, " +
           "CASE " +
           "  WHEN c.updated_at > c.created_at THEN 'CASE_UPDATED' " +
           "  ELSE 'CASE_CREATED' " +
           "END as type, " +
           "CASE " +
           "  WHEN c.updated_at > c.created_at THEN 'Case ' || c.case_title || ' was updated' " +
           "  ELSE 'New case filed: ' || c.case_title " +
           "END as description, " +
           "COALESCE(c.updated_at, c.created_at) as timestamp, " +
           "COALESCE(u.full_name, 'System') as user " +
           "FROM cases c " +
           "LEFT JOIN users u ON u.id = c.assigned_to_id " +
           "ORDER BY timestamp DESC LIMIT 10", nativeQuery = true)
    List<Object[]> findRecentActivities();


    @Query(value = "SELECT c.id, " +
           "CASE " +
           "  WHEN c.updated_at > c.created_at THEN 'CASE_UPDATED' " +
           "  ELSE 'CASE_CREATED' " +
           "END as type, " +
           "CASE " +
           "  WHEN c.updated_at > c.created_at THEN 'Your case ' || c.case_title || ' was updated' " +
           "  ELSE 'New case filed: ' || c.case_title " +
           "END as description, " +
           "COALESCE(c.updated_at, c.created_at) as timestamp " +
           "FROM cases c " +
           "WHERE c.client_id = :userId " +
           "ORDER BY timestamp DESC LIMIT 10", nativeQuery = true)
    List<Object[]> findRecentActivitiesByUser(@Param("userId") Long userId);
}