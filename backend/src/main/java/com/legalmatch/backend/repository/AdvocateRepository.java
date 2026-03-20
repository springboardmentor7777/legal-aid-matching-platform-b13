package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.Advocate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AdvocateRepository extends JpaRepository<Advocate, Integer> {

    // Search by location
    List<Advocate> findByLocationContainingIgnoreCase(String location);

    // Search by specialization
    List<Advocate> findBySpecializationContainingIgnoreCase(String specialization);

    // Filter by both
    List<Advocate> findByLocationContainingIgnoreCaseAndSpecializationContainingIgnoreCase(
            String location, String specialization);
}