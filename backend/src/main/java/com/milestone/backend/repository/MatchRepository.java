package com.milestone.backend.repository;

import com.milestone.backend.entity.Match;
import com.milestone.backend.entity.MatchStatus;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface MatchRepository extends JpaRepository<Match, Long> {

    // ─────────────────────────────────────────────────────────────────────────────
    // Basic derived queries (Spring Data generates the implementation automatically)
    // ─────────────────────────────────────────────────────────────────────────────

    // All matches assigned to a given provider (Lawyer / NGO)
    List<Match> findByUserId(Long userId);

    // All matches generated for a given case
    List<Match> findByCaseId(Long caseId);

    // All non-REJECTED matches for a case — used by getMatchesForCase()
    // to show only active matches when the citizen selects a case from the dropdown
    List<Match> findByCaseIdAndStatusNot(Long caseId, MatchStatus status);

    // All matches for cases owned by a given citizen (traverses case → user)
    List<Match> findByCaseEntity_User_Id(Long userId);

    // Verify that a match belongs to a specific provider
    Optional<Match> findByIdAndUserId(Long id, Long userId);

    // Look up a match by ID and status (e.g. confirm it is still PENDING)
    Optional<Match> findByIdAndStatus(Long id, MatchStatus status);

    // Look up a match by ID, provider, and status combined
    Optional<Match> findByIdAndUserIdAndStatus(Long id, Long userId, MatchStatus status);
    Optional<Match> findByCaseIdAndUserId(Long caseId, Long userId);

    // ─────────────────────────────────────────────────────────────────────────────
    // NEW: Added for CaseService.getPendingCases()
    // Returns all match records for a provider filtered by a single status.
    // Used to find which cases are waiting for this Lawyer/NGO (PENDING matches).
    // ─────────────────────────────────────────────────────────────────────────────
    List<Match> findByUserIdAndStatus(Long userId, MatchStatus status);

    // ─────────────────────────────────────────────────────────────────────────────
    // NEW: Per-provider duplicate guard used inside generateMatches().
    // Returns true if a Match row already exists for this (caseId, providerId) pair,
    // preventing duplicate match cards when the citizen clicks Generate more than once.
    // ─────────────────────────────────────────────────────────────────────────────
    boolean existsByCaseIdAndUserId(Long caseId, Long userId);

    // ─────────────────────────────────────────────────────────────────────────────
    // NEW: Used in getMyMatches() to fetch a citizen's matches while excluding
    // REJECTED rows. Without this filter, stale REJECTED matches from old generate
    // runs would show up as extra cards on the citizen's matching results screen.
    // ─────────────────────────────────────────────────────────────────────────────
    List<Match> findByCaseEntity_User_IdAndStatusNot(Long userId, MatchStatus status);

    // ─────────────────────────────────────────────────────────────────────────────
    // NEW: Added for CaseService.getCaseById()
    // Returns true if a provider has any match for the given case whose status
    // is one of the supplied values (e.g. PENDING or ACCEPTED).
    // Used to authorise Lawyers/NGOs to view case details before accepting.
    // ─────────────────────────────────────────────────────────────────────────────
    boolean existsByCaseIdAndUserIdAndStatusIn(Long caseId, Long userId, List<MatchStatus> statuses);

    // ─────────────────────────────────────────────────────────────────────────────
    // Fetch a match together with its case and the case's citizen in one query.
    // Used by the chat feature to resolve all relationships without extra round-trips.
    // ─────────────────────────────────────────────────────────────────────────────
    @Query("""
            SELECT m FROM Match m
            JOIN FETCH m.caseEntity c
            JOIN FETCH c.user
            WHERE m.id = :matchId
            """)
    Optional<Match> findMatchWithCase(@Param("matchId") Long matchId);

    // ─────────────────────────────────────────────────────────────────────────────
    // Check whether any match for a given case already has the specified status.
    // Used in acceptMatch() to guard against double-accepting the same case.
    // ─────────────────────────────────────────────────────────────────────────────
    boolean existsByCaseIdAndStatus(Long caseId, MatchStatus status);

    // ─────────────────────────────────────────────────────────────────────────────
    // Returns matches visible to a provider on their dashboard.
    //
    // FIX: Removed 'INTERESTED' from the IN clause — that status no longer exists
    // in the flow now that expressInterest has been removed. Providers now see
    // their PENDING matches (cases they can still act on) and ACCEPTED matches
    // (cases the Citizen has confirmed them for).
    // ─────────────────────────────────────────────────────────────────────────────
    @Query("""
            SELECT m FROM Match m
            WHERE m.userId = :userId
            AND m.status IN ('PENDING', 'INTERESTED', 'ACCEPTED')
            """)
    List<Match> findVisibleMatchesForProvider(@Param("userId") Long userId);

    // ─────────────────────────────────────────────────────────────────────────────
    // When a Citizen accepts one match, all other PENDING matches for that case
    // are automatically set to REJECTED so no other provider is left waiting.
    // Called at the end of MatchServiceImpl.acceptMatch().
    // ─────────────────────────────────────────────────────────────────────────────
    @Modifying
    @Transactional
    @Query("""
            UPDATE Match m
            SET m.status = 'REJECTED'
            WHERE m.caseId = :caseId AND m.id != :matchId
            """)
    void rejectOtherMatches(@Param("caseId") Long caseId, @Param("matchId") Long matchId);
}
