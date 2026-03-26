package com.teamthree.legalaid.controller;

import com.teamthree.legalaid.entity.SystemLog;
import com.teamthree.legalaid.repository.SystemLogRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@RestController
@RequestMapping("/admin/logs")

public class SystemLogController {

    private final SystemLogRepository repository;

    public SystemLogController(SystemLogRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public Page<SystemLog> getAllLogs(Pageable pageable) {
        return repository.findAll(pageable);
    }
    
    @GetMapping("/action/{action}")
    public List<SystemLog> getByAction(@PathVariable String action) {
        return repository.findByAction(action);
    }
}