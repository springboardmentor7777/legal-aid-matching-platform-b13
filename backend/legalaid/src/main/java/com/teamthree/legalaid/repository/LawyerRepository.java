package com.teamthree.legalaid.repository;

import com.teamthree.legalaid.entity.LawyerProfile;
import com.teamthree.legalaid.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LawyerRepository extends JpaRepository<LawyerProfile, Long> {
    List<LawyerProfile> findBySpecialization(String specialization);
    List<LawyerProfile> findByIsAvailableTrue();
    List<LawyerProfile> findBySpecializationAndIsAvailableTrue(String specialization);
    Optional<LawyerProfile> findByUser(User user);
}