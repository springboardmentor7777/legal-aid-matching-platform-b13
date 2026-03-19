package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.NotificationEntity;
import com.legalmatch.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {

    List<NotificationEntity> findByUserOrderByCreatedAtDesc(User user);

    long countByUserAndReadFalse(User user);
}
