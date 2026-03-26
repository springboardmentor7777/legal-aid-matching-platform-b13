package com.teamthree.legalaid.repository;
import java.util.List;
import com.teamthree.legalaid.entity.SystemLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SystemLogRepository extends JpaRepository<SystemLog, Long> {
    List<SystemLog> findByAction(String action);
    }