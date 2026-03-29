package com.milestone.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "system_logs")
public class SystemLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private String level; // e.g., "INFO", "WARN", "ERROR"

    @Column(nullable = false)
    private String source; // e.g., "AuthService", "CaseService"

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    // Constructors
    public SystemLog() {}

    public SystemLog(String level, String source, String message) {
        this.timestamp = LocalDateTime.now(); // Automatically sets the current time
        this.level = level;
        this.source = source;
        this.message = message;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}