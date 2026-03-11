package com.teamthree.legalaid.repository;

import com.teamthree.legalaid.entity.Case;
import com.teamthree.legalaid.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByCase_OrderByMatchScoreDesc(Case case_);
    List<Match> findByCase_AndStatus(Case case_, String status);
    List<Match> findByProfileIdAndProfileType(Long profileId, String profileType);
    boolean existsByCase_AndProfileIdAndProfileType(Case case_, Long profileId, String profileType);
}
