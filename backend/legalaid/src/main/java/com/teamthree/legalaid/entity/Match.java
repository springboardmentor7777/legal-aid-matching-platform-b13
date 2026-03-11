package com.teamthree.legalaid.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "case_id")
    private Case case_;

    @Column(name = "profile_id")
    private Long profileId;

    @Column(name = "profile_type")
    private String profileType;

    @Column(name = "match_score")
    private Integer matchScore;

    @Column(name = "status")
    private String status;

    @Column(name = "match_date")
    private LocalDateTime matchDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Match() {
        this.createdAt = LocalDateTime.now();
        this.status = "PENDING";
    }

    public Long getId() {
        return id;
    }

    public Case getCase() {
        return case_;
    }

    public void setCase(Case case_) {
        this.case_ = case_;
    }

    public Long getProfileId() {
        return profileId;
    }

    public void setProfileId(Long profileId) {
        this.profileId = profileId;
    }

    public String getProfileType() {
        return profileType;
    }

    public void setProfileType(String profileType) {
        this.profileType = profileType;
    }

    public Integer getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(Integer matchScore) {
        this.matchScore = matchScore;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getMatchDate() {
        return matchDate;
    }

    public void setMatchDate(LocalDateTime matchDate) {
        this.matchDate = matchDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}