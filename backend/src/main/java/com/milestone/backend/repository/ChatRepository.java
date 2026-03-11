package com.milestone.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.milestone.backend.entity.Chat;
import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    
    // Get chat history for a specific match, ordered from oldest to newest
    List<Chat> findByMatch_IdOrderByTimestampAsc(Long matchId);
}