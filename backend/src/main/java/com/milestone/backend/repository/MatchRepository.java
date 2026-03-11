package com.milestone.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.milestone.backend.entity.Match;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    
}