package com.teamthree.legalaid.repository;

import com.teamthree.legalaid.entity.LawyerProfile;
import com.teamthree.legalaid.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LawyerRepository extends JpaRepository<LawyerProfile, Long>, JpaSpecificationExecutor<LawyerProfile> {
    List<LawyerProfile> findBySpecialization(String specialization);
    List<LawyerProfile> findByIsAvailableTrue();
    List<LawyerProfile> findBySpecializationAndIsAvailableTrue(String specialization);
    Optional<LawyerProfile> findByUser(User user);

    // Directory filters
    List<LawyerProfile> findByVerifiedTrue();
    List<LawyerProfile> findByLocation(String location);
    List<LawyerProfile> findByExpertiseContainingIgnoreCase(String expertise);

    @Query("SELECT l FROM LawyerProfile l WHERE " +
           "(:expertise IS NULL OR LOWER(l.expertise) LIKE LOWER(CONCAT('%', :expertise, '%'))) AND " +
           "(:location IS NULL OR LOWER(l.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:verified IS NULL OR l.verified = :verified)")
    List<LawyerProfile> findByFilters(
        @Param("expertise") String expertise,
        @Param("location") String location,
        @Param("verified") Boolean verified
    );
}