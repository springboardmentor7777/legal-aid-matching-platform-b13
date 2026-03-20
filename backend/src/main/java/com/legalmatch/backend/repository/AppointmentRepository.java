package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.AppointmentEntity;
import com.legalmatch.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<AppointmentEntity, Long> {

    @Query("SELECT a FROM AppointmentEntity a WHERE a.match.citizen = :user OR a.match.provider = :user ORDER BY a.appointmentDate DESC")
    List<AppointmentEntity> findByParticipant(@Param("user") User user);

    List<AppointmentEntity> findByCreatedByOrderByCreatedAtDesc(User createdBy);
}
