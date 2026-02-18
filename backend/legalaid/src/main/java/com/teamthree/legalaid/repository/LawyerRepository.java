package com.teamthree.legalaid.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.teamthree.legalaid.entity.LawyerProfile;
import com.teamthree.legalaid.entity.User;

public interface LawyerRepository extends JpaRepository<LawyerProfile, Long> {
    List<LawyerProfile> findBySpecialization(String specialization);
    List<LawyerProfile> findByIsAvailableTrue();
    List<LawyerProfile> findBySpecializationAndIsAvailableTrue(String specialization);
    Optional<LawyerProfile> findByUser(User user);
}