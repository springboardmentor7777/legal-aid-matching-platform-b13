package com.legalmatch.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_type", nullable = false, length = 100)
    private String eventType;

    @Column(nullable = false, length = 20)
    private String severity;

    @Column(length = 100)
    private String source;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(columnDefinition = "TEXT")
    private String metadata;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.severity == null) {
            this.severity = "INFO";
        }
    }
}
