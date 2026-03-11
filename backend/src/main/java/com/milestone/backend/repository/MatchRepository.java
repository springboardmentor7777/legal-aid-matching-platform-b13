package com.milestone.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.milestone.backend.entity.Match;
import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    // For the Citizen: Find all matches connected to cases they created
    List<Match> findByLegalCase_User_Id(Long citizenId);

    // For the Lawyer/NGO: Find all cases assigned to them
    List<Match> findByMatchedProvider_Id(Long providerId);
}