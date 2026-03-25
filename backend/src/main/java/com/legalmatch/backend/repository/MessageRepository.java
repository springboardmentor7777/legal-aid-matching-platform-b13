package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.MatchEntity;
import com.legalmatch.backend.entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<MessageEntity, Long> {

    // ✅ Get all messages for a match (chat history)
    List<MessageEntity> findByMatchOrderByCreatedAtAsc(MatchEntity match);

}

