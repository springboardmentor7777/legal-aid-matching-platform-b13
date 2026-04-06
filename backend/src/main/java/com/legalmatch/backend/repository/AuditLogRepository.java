package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findTop50ByOrderByCreatedAtDesc();

    List<AuditLog> findByEventTypeOrderByCreatedAtDesc(String eventType);

    long countBySeverity(String severity);
}
