package com.milestone.backend.controller;

import com.milestone.backend.dto.LawyerDto;
import com.milestone.backend.dto.NgoDto;
import com.milestone.backend.service.DirectoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/directory")
@RequiredArgsConstructor
public class DirectoryController {

    private final DirectoryService directoryService;

    @GetMapping("/lawyers")
    public ResponseEntity<List<LawyerDto>> getLawyerDirectory() {
        return ResponseEntity.ok(directoryService.getAllLawyers());
    }

    @GetMapping("/ngos")
    public ResponseEntity<List<NgoDto>> getNgoDirectory() {
        return ResponseEntity.ok(directoryService.getAllNgos());
    }
}