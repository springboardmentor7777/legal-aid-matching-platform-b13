package com.teamthree.legalaid.controller;

import com.teamthree.legalaid.dto.LawyerDirectoryDTO;
import com.teamthree.legalaid.dto.NgoDirectoryDTO;
import com.teamthree.legalaid.dto.PagedResponse;
import com.teamthree.legalaid.service.DirectoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/directory")
@RequiredArgsConstructor
public class DirectoryController {

    private final DirectoryService directoryService;

    /**
     * GET /directory/lawyers
     *
     * Query params (all optional):
     *   keyword   — searches across name, expertise, location, specialization
     *   expertise — filter by expertise (partial match)
     *   location  — filter by location (partial match)
     *   verified  — filter by verification status (true/false)
     *   page      — page number, default 0
     *   size      — page size, default 10
     *   sortBy    — field to sort by, default "id"
     *   sortDir   — "asc" or "desc", default "asc"
     */
    @GetMapping("/lawyers")
    public ResponseEntity<PagedResponse<LawyerDirectoryDTO>> getLawyers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String expertise,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Boolean verified,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        return ResponseEntity.ok(
            directoryService.getLawyers(keyword, expertise, location, verified, page, size, sortBy, sortDir)
        );
    }

    /**
     * GET /directory/ngos
     *
     * Same query params as /directory/lawyers
     */
    @GetMapping("/ngos")
    public ResponseEntity<PagedResponse<NgoDirectoryDTO>> getNgos(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String expertise,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Boolean verified,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        return ResponseEntity.ok(
            directoryService.getNgos(keyword, expertise, location, verified, page, size, sortBy, sortDir)
        );
    }
}