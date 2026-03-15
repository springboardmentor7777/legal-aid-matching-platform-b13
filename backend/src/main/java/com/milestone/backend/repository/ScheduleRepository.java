// package com.milestone.backend.repository;

// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;
// import com.milestone.backend.entity.Schedule;
// import java.util.List;

// @Repository
// public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    
//     // Find all scheduled appointments for a specific match
//     List<Schedule> findByMatch_Id(Long matchId);

//     List<Schedule> findByMatch_LegalCase_User_IdOrMatch_MatchedProvider_Id(Long citizenId, Long providerId);
// }

package com.milestone.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.milestone.backend.entity.Schedule;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    
    List<Schedule> findByMatch_Id(Long matchId);

    // FIXED: Custom query handles the relationship manually since Match only holds raw IDs
    @Query("SELECT s FROM Schedule s JOIN Case c ON s.match.caseId = c.id WHERE c.user.id = :userId OR s.match.userId = :userId")
    List<Schedule> findAllUserAppointments(@Param("userId") Long userId);
}