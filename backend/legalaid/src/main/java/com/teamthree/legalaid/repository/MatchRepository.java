package com.teamthree.legalaid.repository;

import com.teamthree.legalaid.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    List<Match> findByCaseId(Long caseId);

    List<Match> findByLawyerId(Long lawyerId);

    List<Match> findByNgoId(Long ngoId);

}