package com.teamthree.legalaid.repository;

import com.teamthree.legalaid.entity.Case;
import com.teamthree.legalaid.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    @Query("SELECT m FROM Match m WHERE m.case_ = :case_ ORDER BY m.matchScore DESC")
    List<Match> findByCase_OrderByMatchScoreDesc(@Param("case_") Case case_);

    @Query("SELECT m FROM Match m WHERE m.case_ = :case_ AND m.status = :status")
    List<Match> findByCase_AndStatus(@Param("case_") Case case_, @Param("status") String status);

    List<Match> findByProfileIdAndProfileType(Long profileId, String profileType);

    @Query("SELECT COUNT(m) > 0 FROM Match m WHERE m.case_ = :case_ AND m.profileId = :profileId AND m.profileType = :profileType")
    boolean existsByCase_AndProfileIdAndProfileType(
            @Param("case_") Case case_,
            @Param("profileId") Long profileId,
            @Param("profileType") String profileType);
}