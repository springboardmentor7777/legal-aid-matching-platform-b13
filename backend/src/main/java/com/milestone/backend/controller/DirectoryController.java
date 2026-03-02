package com.milestone.backend.controller;

import com.milestone.backend.dto.LawyerDto;
import com.milestone.backend.dto.NgoDto;
import com.milestone.backend.service.DirectoryService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/directory")    // FIX 1: was "/directory" — needs /api/v1 prefix
@RequiredArgsConstructor
@CrossOrigin(origins = "*")             // FIX 2: was missing — needed for frontend access
public class DirectoryController {

    private final DirectoryService directoryService;

    // GET /api/v1/directory/lawyers
    @GetMapping("/lawyers")
    @PreAuthorize("isAuthenticated()")  // FIX 3: was missing — all endpoints need auth per Milestone 2 doc
    public ResponseEntity<List<LawyerDto>> getLawyerDirectory() {
        return ResponseEntity.ok(directoryService.getAllLawyers());
    }

    // GET /api/v1/directory/lawyers/{id}
    @GetMapping("/lawyers/{id}")
    @PreAuthorize("isAuthenticated()")  // FIX 4: entire endpoint was missing
    public ResponseEntity<LawyerDto> getLawyerById(@PathVariable Long id) {
        return ResponseEntity.ok(directoryService.getLawyerById(id));
    }

    // GET /api/v1/directory/lawyers/search?location=&expertise=&isVerified=
    @GetMapping("/lawyers/search")
    @PreAuthorize("isAuthenticated()")  // FIX 5: was missing
    public ResponseEntity<Page<LawyerDto>> searchLawyers(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String expertise,
            @RequestParam(required = false) Boolean isVerified,
            Pageable pageable) {

        return ResponseEntity.ok(directoryService.searchLawyers(location, expertise, isVerified, pageable));
    }

    // GET /api/v1/directory/ngos
    @GetMapping("/ngos")
    @PreAuthorize("isAuthenticated()")  // FIX 6: was missing
    public ResponseEntity<List<NgoDto>> getNgoDirectory() {
        return ResponseEntity.ok(directoryService.getAllNgos());
    }

    // GET /api/v1/directory/ngos/{id}
    @GetMapping("/ngos/{id}")
    @PreAuthorize("isAuthenticated()")  // FIX 7: entire endpoint was missing
    public ResponseEntity<NgoDto> getNgoById(@PathVariable Long id) {
        return ResponseEntity.ok(directoryService.getNgoById(id));
    }

    // GET /api/v1/directory/ngos/search?location=&isVerified=
    @GetMapping("/ngos/search")
    @PreAuthorize("isAuthenticated()")  // FIX 8: was missing
    public ResponseEntity<Page<NgoDto>> searchNgos(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Boolean isVerified,
            Pageable pageable) {

        return ResponseEntity.ok(directoryService.searchNgos(location, isVerified, pageable));
    }
}
