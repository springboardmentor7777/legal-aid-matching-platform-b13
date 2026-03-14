package com.teamthree.legalaid.repository;

import com.teamthree.legalaid.entity.Appointment;
import com.teamthree.legalaid.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByUserOrderByScheduledTimeDesc(User user);

    List<Appointment> findByMatch_IdOrderByScheduledTimeDesc(Long matchId);

    @Query("""
        SELECT a FROM Appointment a
        WHERE a.match.profileId = :profileId
          AND a.match.profileType = 'LAWYER'
        ORDER BY a.scheduledTime DESC
    """)
    List<Appointment> findByLawyerProfileId(@Param("profileId") Long profileId);

    @Query("""
        SELECT a FROM Appointment a
        WHERE a.match.profileId = :profileId
          AND a.match.profileType = 'NGO'
        ORDER BY a.scheduledTime DESC
    """)
    List<Appointment> findByNgoProfileId(@Param("profileId") Long profileId);
}