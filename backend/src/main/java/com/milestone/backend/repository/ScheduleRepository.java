package com.milestone.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.milestone.backend.entity.Schedule;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    
    // Find all scheduled appointments for a specific match
    List<Schedule> findByMatch_Id(Long matchId);

    List<Schedule> findByMatch_LegalCase_User_IdOrMatch_MatchedProvider_Id(Long citizenId, Long providerId);
}