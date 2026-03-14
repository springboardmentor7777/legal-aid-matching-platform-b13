package com.milestone.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.milestone.backend.entity.ImpactLog;

@Repository
public interface ImpactLogRepository extends JpaRepository<ImpactLog, Long> {
    
    // Allows the backend to find a specific lawyer/NGO's impact log
    ImpactLog findByProvider_Id(Long providerId);
}