package com.milestone.backend.controller;

import com.milestone.backend.dto.LawyerDto;
import com.milestone.backend.dto.NgoDto;
import com.milestone.backend.service.DirectoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestParam;

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

    @GetMapping("/lawyers/search")
    public ResponseEntity<Page<LawyerDto>> searchLawyers(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String expertise,
            @RequestParam(required = false) Boolean isVerified,
            Pageable pageable) {
        
        return ResponseEntity.ok(directoryService.searchLawyers(location, expertise, isVerified, pageable));
    }

    @GetMapping("/ngos/search")
    public ResponseEntity<Page<NgoDto>> searchNgos(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Boolean isVerified,
            Pageable pageable) {
        
        return ResponseEntity.ok(directoryService.searchNgos(location, isVerified, pageable));
    }
}