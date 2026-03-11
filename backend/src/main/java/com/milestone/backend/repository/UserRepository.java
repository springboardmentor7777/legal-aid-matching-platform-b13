package com.milestone.backend.repository;

import java.util.Optional;
import java.util.List; 
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository; // 🔹 1. Added this import!

import com.milestone.backend.entity.User;
import com.milestone.backend.entity.Role; 


@Repository // 🔹 2. Added this annotation to force Spring to create the Bean!
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);

    // Added this method to fetch users by their role (LAWYER, NGO, etc.)
    List<User> findAllByRole(Role role);

    // Part D: Search, Filter, and Pagination Logic
    @Query("SELECT u FROM User u LEFT JOIN u.lawyerProfile lp WHERE u.role = :role " +
           "AND (CAST(:location AS string) IS NULL OR LOWER(lp.location) LIKE LOWER(CONCAT('%', CAST(:location AS string), '%'))) " +
           "AND (CAST(:expertise AS string) IS NULL OR LOWER(lp.specialization) LIKE LOWER(CONCAT('%', CAST(:expertise AS string), '%'))) " +
           "AND (:isVerified IS NULL OR u.isVerified = :isVerified)")
    Page<User> searchLawyers(
            @Param("role") Role role,
            @Param("location") String location,
            @Param("expertise") String expertise,
            @Param("isVerified") Boolean isVerified,
            Pageable pageable);

    // Part D: Search, Filter, and Pagination for NGOs
    @Query("SELECT u FROM User u LEFT JOIN u.ngoProfile np WHERE u.role = :role " +
           "AND (CAST(:location AS string) IS NULL OR LOWER(np.serviceArea) LIKE LOWER(CONCAT('%', CAST(:location AS string), '%'))) " +
           "AND (:isVerified IS NULL OR u.isVerified = :isVerified)")
    Page<User> searchNgos(
            @Param("role") Role role,
            @Param("location") String location,
            @Param("isVerified") Boolean isVerified,
            Pageable pageable);
}