package com.teamthree.legalaid.service;

import com.teamthree.legalaid.entity.SystemLog;
import com.teamthree.legalaid.repository.SystemLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SystemLogService {

    private final SystemLogRepository repository;

    public SystemLogService(SystemLogRepository repository) {
        this.repository = repository;
    }

    public void log(String action, String username, String role, String details, String status) {
        SystemLog log = SystemLog.builder()
                .action(action)
                .username(username)
                .role(role)
                .details(details)
                .status(status)
                .timestamp(LocalDateTime.now())
                .build();

        repository.save(log);
    }
}