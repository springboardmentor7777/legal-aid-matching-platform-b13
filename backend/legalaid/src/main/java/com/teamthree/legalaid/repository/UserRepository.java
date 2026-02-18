package com.teamthree.legalaid.repository;

import java.util.List;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.teamthree.legalaid.entity.Role;
import com.teamthree.legalaid.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
<<<<<<< HEAD
	
	Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);
	
=======

		
>>>>>>> branch 'team-three' of https://github.com/springboardmentor7777/legal-aid-matching-platform-b13.git
}
