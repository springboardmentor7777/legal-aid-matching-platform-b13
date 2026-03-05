package com.teamthree.legalaid.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.teamthree.legalaid.entity.NgoProfile;
import com.teamthree.legalaid.entity.User;

@Repository
public interface NgoProfileRepository extends JpaRepository<NgoProfile, Long>, JpaSpecificationExecutor<NgoProfile> {

    List<NgoProfile> findByIsActiveTrue();
    Optional<NgoProfile> findByUser(User user);

    // Directory filters
    List<NgoProfile> findByVerifiedTrue();
    List<NgoProfile> findByLocation(String location);
    List<NgoProfile> findByExpertiseContainingIgnoreCase(String expertise);

    @Query("SELECT n FROM NgoProfile n WHERE " +
           "(:expertise IS NULL OR LOWER(n.expertise) LIKE LOWER(CONCAT('%', :expertise, '%'))) AND " +
           "(:location IS NULL OR LOWER(n.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:verified IS NULL OR n.verified = :verified)")
    List<NgoProfile> findByFilters(
        @Param("expertise") String expertise,
        @Param("location") String location,
        @Param("verified") Boolean verified
    );
}