package com.teamthree.legalaid.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.teamthree.legalaid.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

		
}
