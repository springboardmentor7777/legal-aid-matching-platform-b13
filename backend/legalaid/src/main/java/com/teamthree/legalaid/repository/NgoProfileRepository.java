package com.teamthree.legalaid.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.teamthree.legalaid.entity.NgoProfile;
import com.teamthree.legalaid.entity.User;

public interface NgoProfileRepository extends JpaRepository<NgoProfile, Long>{
	
	List<NgoProfile> findByIsActiveTrue();
    Optional<NgoProfile> findByUser(User user);
}
