package com.milestone.backend.repository;

import com.milestone.backend.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    // For the Citizen: Find all matches connected to cases they created
    @Query("SELECT m FROM Match m " +
           "JOIN FETCH m.legalCase c " +
           "JOIN FETCH m.matchedProvider p " +
           "LEFT JOIN FETCH p.lawyerProfile lp " +
           "LEFT JOIN FETCH p.ngoProfile np " +
           "WHERE c.user.id = :citizenId")
    List<Match> findByLegalCase_User_Id(Long citizenId);

    // For the Lawyer/NGO: Find all cases assigned to them with profiles
    @Query("SELECT m FROM Match m " +
           "JOIN FETCH m.legalCase c " +
           "JOIN FETCH m.matchedProvider p " +
           "LEFT JOIN FETCH p.lawyerProfile lp " +
           "LEFT JOIN FETCH p.ngoProfile np " +
           "WHERE p.id = :providerId")
    List<Match> findByMatchedProvider_Id(Long providerId);

    // Check if a match already exists (prevent duplicates)
    boolean existsByLegalCase_IdAndMatchedProvider_Id(Long caseId, Long providerId);

    // Optional: Find all pending matches for a provider
    @Query("SELECT m FROM Match m " +
           "JOIN FETCH m.legalCase c " +
           "JOIN FETCH m.matchedProvider p " +
           "LEFT JOIN FETCH p.lawyerProfile lp " +
           "LEFT JOIN FETCH p.ngoProfile np " +
           "WHERE p.id = :providerId AND m.status = :status")
    List<Match> findByMatchedProvider_IdAndStatus(Long providerId, Match.MatchStatus status);

    // Optional: Find matches for a specific case with providers and profiles
    @Query("SELECT m FROM Match m " +
           "JOIN FETCH m.legalCase c " +
           "JOIN FETCH m.matchedProvider p " +
           "LEFT JOIN FETCH p.lawyerProfile lp " +
           "LEFT JOIN FETCH p.ngoProfile np " +
           "WHERE c.id = :caseId")
    List<Match> findByCaseWithProvider(Long caseId);
}