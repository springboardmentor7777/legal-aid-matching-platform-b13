package com.milestone.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.milestone.backend.entity.ExternalLawyers;

public interface ExternalLawyersRepository extends JpaRepository<ExternalLawyers, Long> {

    @Query("SELECT e.email FROM ExternalLawyers e WHERE e.email IN :emails")
    List<String> findExistingEmails(@Param("emails") List<String> emails);
}