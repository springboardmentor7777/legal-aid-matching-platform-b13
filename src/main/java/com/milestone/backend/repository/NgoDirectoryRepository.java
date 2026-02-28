package com.milestone.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.milestone.backend.entity.NgoDirectory;

public interface NgoDirectoryRepository
        extends JpaRepository<NgoDirectory, Long> {

    boolean existsByNameAndLocation(String name, String location);
}