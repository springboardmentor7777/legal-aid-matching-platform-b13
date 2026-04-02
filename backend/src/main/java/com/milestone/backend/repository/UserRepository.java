package com.milestone.backend.repository;

import java.util.List;
import java.util.Optional;

import com.milestone.backend.entity.Role;
import com.milestone.backend.entity.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 🔹 Authentication
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // 🔹 Role-based queries
    List<User> findAllByRole(Role role);

    List<User> findByRoleIn(List<Role> roles);

    // 🔹 Analytics
    long countByRole(Role role);

    // 🔹 Pending Verifications (Admin API)
    List<User> findByIsVerifiedFalse();

    // ================= AVAILABLE PROVIDERS =================

    // 🔹 Available Lawyers
    @Query("""
                SELECT u FROM User u
                JOIN u.lawyerProfile lp
                WHERE u.role = :role
                AND lp.isAvailable = true
                AND u.enabled = true
            """)
    List<User> findAvailableLawyers(@Param("role") Role role);

    // 🔹 Available NGOs
    @Query("""
                SELECT u FROM User u
                JOIN u.ngoProfile np
                WHERE u.role = :role
                AND np.isAvailable = true
                AND u.enabled = true
            """)
    List<User> findAvailableNgos(@Param("role") Role role);

    // ================= SEARCH + FILTER =================

    // 🔹 Search Lawyers
    @Query("""
                SELECT u FROM User u
                LEFT JOIN u.lawyerProfile lp
                WHERE u.role = :role
                AND (:location IS NULL OR LOWER(lp.location) LIKE LOWER(CONCAT('%', :location, '%')))
                AND (:expertise IS NULL OR LOWER(lp.specialization) LIKE LOWER(CONCAT('%', :expertise, '%')))
                AND (:isVerified IS NULL OR u.isVerified = :isVerified)
                AND u.enabled = true
            """)
    Page<User> searchLawyers(
            @Param("role") Role role,
            @Param("location") String location,
            @Param("expertise") String expertise,
            @Param("isVerified") Boolean isVerified,
            Pageable pageable);

    // 🔹 Search NGOs
    @Query("""
                SELECT u FROM User u
                LEFT JOIN u.ngoProfile np
                WHERE u.role = :role
                AND (:location IS NULL OR LOWER(np.serviceArea) LIKE LOWER(CONCAT('%', :location, '%')))
                AND (:isVerified IS NULL OR u.isVerified = :isVerified)
                AND u.enabled = true
            """)
    Page<User> searchNgos(
            @Param("role") Role role,
            @Param("location") String location,
            @Param("isVerified") Boolean isVerified,
            Pageable pageable);

    // ================= ADMIN DASHBOARD =================

    @Query("""
                SELECT new com.milestone.backend.dto.RoleCountDto(u.role, COUNT(u))
                FROM User u
                GROUP BY u.role
            """)
    List<com.milestone.backend.dto.RoleCountDto> countUsersByRole();

    @Query("SELECT u FROM User u WHERE u.role IN (com.milestone.backend.entity.Role.LAWYER, com.milestone.backend.entity.Role.NGO) AND u.isVerified IS NULL")
    List<User> findPendingVerifications();
}