package com.milestone.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.milestone.backend.entity.Notification;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    // Get all notifications for a user, newest first
    List<Notification> findByUser_IdOrderByCreatedAtDesc(Long userId);

    // Get ONLY the unread notifications (useful for a notification counter/badge)
    List<Notification> findByUser_IdAndIsReadFalse(Long userId);
}