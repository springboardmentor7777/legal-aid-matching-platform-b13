package com.teamthree.legalaid.repository;

import com.teamthree.legalaid.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByMatchId(Long matchId);

}
