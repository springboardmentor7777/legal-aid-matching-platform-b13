package com.teamthree.legalaid.repository;

import com.teamthree.legalaid.entity.Match;
import com.teamthree.legalaid.entity.Case;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    // Get matches for a specific case sorted by score
    List<Match> findByCaseEntityOrderByMatchScoreDesc(Case caseEntity);

    // Check if match already exists
    boolean existsByCaseEntityAndProfileIdAndProfileType(
            Case caseEntity,
            Long profileId,
            String profileType
    );

    // For lawyer dashboard
    List<Match> findByProfileIdAndProfileType(Long profileId, String profileType);
}