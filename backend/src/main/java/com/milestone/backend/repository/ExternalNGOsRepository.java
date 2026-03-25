package com.milestone.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.milestone.backend.entity.ExternalNGOs;

public interface ExternalNGOsRepository extends JpaRepository<ExternalNGOs, Long> {
    // boolean existByNameAndLocation(String name, String location);
}
