package com.milestone.backend.repository;

import com.milestone.backend.entity.Match;
import com.milestone.backend.entity.MatchStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MatchRepository extends JpaRepository<Match, Long> {

    // get all matches for a user
    List<Match> findByUserId(Long userId);

    // get matches for a case
    List<Match> findByCaseId(Long caseId);

    // verify user belongs to match
    Optional<Match> findByIdAndUserId(Long id, Long userId);

    // verify accepted match
    Optional<Match> findByIdAndStatus(Long id, MatchStatus status);

    // verify accepted match with user
    Optional<Match> findByIdAndUserIdAndStatus(Long id, Long userId, MatchStatus status);
}