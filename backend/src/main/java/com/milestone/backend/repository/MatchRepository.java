package com.milestone.backend.repository;

import com.milestone.backend.entity.Match;
import com.milestone.backend.entity.MatchStatus;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface MatchRepository extends JpaRepository<Match, Long> {

    // get all matches for a provider (lawyer / NGO)
    List<Match> findByUserId(Long userId);

    // get matches for a case
    List<Match> findByCaseId(Long caseId);

    // get matches for citizen (by case owner)
    List<Match> findByCaseEntity_User_Id(Long userId);

    // verify user belongs to match
    Optional<Match> findByIdAndUserId(Long id, Long userId);

    // verify accepted match
    Optional<Match> findByIdAndStatus(Long id, MatchStatus status);

    // verify accepted match with user
    Optional<Match> findByIdAndUserIdAndStatus(Long id, Long userId, MatchStatus status);

    // ⭐ Fetch match + case + citizen (used for chat)
    @Query("""
        SELECT m FROM Match m
        JOIN FETCH m.caseEntity c
        JOIN FETCH c.user
        WHERE m.id = :matchId
    """)
    Optional<Match> findMatchWithCase(@Param("matchId") Long matchId);

    // ================================
    // 🔥 NEW METHODS (IMPORTANT)
    // ================================

    // ✅ Check if case already accepted
    boolean existsByCaseIdAndStatus(Long caseId, MatchStatus status);

    // ✅ Show only visible matches to provider
    @Query("""
        SELECT m FROM Match m
        WHERE m.userId = :userId
        AND (
            m.status = 'PENDING'
            OR (m.status = 'ACCEPTED' AND m.userId = :userId)
        )
    """)
    List<Match> findVisibleMatchesForProvider(@Param("userId") Long userId);

    // ✅ Reject all other matches when one is accepted
    @Modifying
    @Transactional
    @Query("""
        UPDATE Match m
        SET m.status = 'REJECTED'
        WHERE m.caseId = :caseId AND m.id != :matchId
    """)
    void rejectOtherMatches(@Param("caseId") Long caseId,
                            @Param("matchId") Long matchId);
}