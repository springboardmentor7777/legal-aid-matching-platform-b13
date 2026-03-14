package com.milestone.backend.repository;

import com.milestone.backend.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    @Query("SELECT m FROM Match m " +
           "LEFT JOIN FETCH m.legalCase c " +
           "LEFT JOIN FETCH m.matchedProvider p " +
           "LEFT JOIN FETCH p.lawyerProfile lp " +
           "LEFT JOIN FETCH p.ngoProfile np " +
           "WHERE c.user.id = :citizenId " +
           "ORDER BY m.score DESC")
    List<Match> findByLegalCase_User_IdOrderByScoreDesc(@Param("citizenId") Long citizenId);

    @Query("SELECT m FROM Match m " +
           "LEFT JOIN FETCH m.legalCase c " +
           "LEFT JOIN FETCH m.matchedProvider p " +
           "LEFT JOIN FETCH p.lawyerProfile lp " +
           "LEFT JOIN FETCH p.ngoProfile np " +
           "WHERE p.id = :providerId " +
           "ORDER BY m.score DESC")
    List<Match> findByMatchedProvider_IdOrderByScoreDesc(@Param("providerId") Long providerId);

    @Query("SELECT m FROM Match m " +
           "LEFT JOIN FETCH m.legalCase c " +
           "LEFT JOIN FETCH m.matchedProvider p " +
           "LEFT JOIN FETCH p.lawyerProfile lp " +
           "LEFT JOIN FETCH p.ngoProfile np " +
           "WHERE m.id = :matchId")
    Optional<Match> findByIdWithProfiles(@Param("matchId") Long matchId);

    boolean existsByLegalCase_IdAndMatchedProvider_Id(Long caseId, Long providerId);
}