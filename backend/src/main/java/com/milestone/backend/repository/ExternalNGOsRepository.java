package com.milestone.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.milestone.backend.entity.ExternalNGOs;

public interface ExternalNGOsRepository extends JpaRepository<ExternalNGOs, Long> {
    // boolean existByNameAndLocation(String name, String location);
    @Query("SELECT e.email FROM ExternalNGOs e WHERE e.email IN :emails")
    List<String> findExistingEmails(@Param("emails") List<String> emails);

    @Query("SELECT e.organizationName FROM ExternalNGOs e WHERE e.organizationName IN :org")
    List<String> findExistingOrg(@Param("org") List<String> org);
}
