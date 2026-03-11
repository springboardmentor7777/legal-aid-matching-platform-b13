package com.milestone.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.milestone.backend.entity.Chat;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
}