package com.milestone.backend.entity;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "schedules")
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String appointmentDate;
    private String appointmentTime;

    @Column(columnDefinition = "TEXT")
    private String notes;

    // Connects the appointment to the specific Match
    @ManyToOne
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @Column(nullable = false)
    private LocalDateTime scheduledTime;

    // Status can be SCHEDULED, COMPLETED, or CANCELLED
    @Column(nullable = false)
    private String status = "SCHEDULED";
}