package com.legalmatch.backend.controller;

import com.legalmatch.backend.service.DirectoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/directory")
@RequiredArgsConstructor
public class DirectoryController {

    private final DirectoryService service;

    @GetMapping("/lawyers")
    public ResponseEntity<?> getLawyers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(service.getLawyers(page, size));
    }

    @GetMapping("/ngos")
    public ResponseEntity<?> getNgos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(service.getNgos(page, size));
    }
}