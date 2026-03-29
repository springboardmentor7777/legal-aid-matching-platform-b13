package com.milestone.backend.service;

import org.springframework.stereotype.Service;
import com.milestone.backend.entity.SystemLog;
import com.milestone.backend.repository.SystemLogRepository;

@Service
public class SystemLogService {

    private final SystemLogRepository systemLogRepository;

    public SystemLogService(SystemLogRepository systemLogRepository) {
        this.systemLogRepository = systemLogRepository;
    }

    // Call this method from anywhere to save a log to PostgreSQL
    public void logEvent(String level, String source, String message) {
        SystemLog log = new SystemLog(level, source, message);
        systemLogRepository.save(log);
    }
    
    //  frontend will use this to get the feed
    public java.util.List<SystemLog> getRecentLogs() {
        return systemLogRepository.findAllByOrderByTimestampDesc();
    }
}