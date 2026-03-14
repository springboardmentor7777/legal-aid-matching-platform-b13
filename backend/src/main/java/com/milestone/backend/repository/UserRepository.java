package com.milestone.backend.repository;

import java.util.List;
import java.util.Optional;

import com.milestone.backend.entity.Role;
import com.milestone.backend.entity.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find by email
    Optional<User> findByEmail(String email);

    // Check if email exists
    boolean existsByEmail(String email);

    // Fetch all users by role
    List<User> findAllByRole(Role role);

    // --- Fetch only available providers for matching ---
    
    // Available Lawyers
    @Query("SELECT u FROM User u JOIN u.lawyerProfile lp WHERE u.role = :role AND lp.isAvailable = true")
    List<User> findAvailableLawyers(@Param("role") Role role);

    // Available NGOs
    @Query("SELECT u FROM User u JOIN u.ngoProfile np WHERE u.role = :role AND np.isAvailable = true")
    List<User> findAvailableNgos(@Param("role") Role role);

    // --- Search and filter with pagination ---

    // Search and filter Lawyers
    @Query("SELECT u FROM User u LEFT JOIN u.lawyerProfile lp WHERE u.role = :role " +
           "AND (:location IS NULL OR LOWER(lp.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "AND (:expertise IS NULL OR LOWER(lp.specialization) LIKE LOWER(CONCAT('%', :expertise, '%'))) " +
           "AND (:isVerified IS NULL OR u.isVerified = :isVerified)")
    Page<User> searchLawyers(
            @Param("role") Role role,
            @Param("location") String location,
            @Param("expertise") String expertise,
            @Param("isVerified") Boolean isVerified,
            Pageable pageable
    );

    // Search and filter NGOs
    @Query("SELECT u FROM User u LEFT JOIN u.ngoProfile np WHERE u.role = :role " +
           "AND (:location IS NULL OR LOWER(np.serviceArea) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "AND (:isVerified IS NULL OR u.isVerified = :isVerified)")
    Page<User> searchNgos(
            @Param("role") Role role,
            @Param("location") String location,
            @Param("isVerified") Boolean isVerified,
            Pageable pageable
    );
}