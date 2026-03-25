package com.milestone.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.milestone.backend.service.LawyerExcelService;
import com.milestone.backend.dto.ExternalLawyerResponseDto;
import com.milestone.backend.service.ExternalLawyersDataService;

@RestController
@RequestMapping("/directory/external/lawyers")
public class ExternalLaywerController {

    private final LawyerExcelService excelService;
    private final ExternalLawyersDataService lawyerDataService;

    public ExternalLaywerController(LawyerExcelService excelService, ExternalLawyersDataService lawyerDataService) {
        this.excelService = excelService;
        this.lawyerDataService = lawyerDataService;
    }

    // FIXED: Changed return type to ResponseEntity to properly return the Map as JSON
    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadExcel(@RequestParam("file") MultipartFile file) {
        try {
            var users = excelService.parseLawyerExcel(file.getInputStream());
            Map<String, Object> result = lawyerDataService.saveUniqueLawyers(users);
            
            // Returns a 200 OK with the statistics Map
            return ResponseEntity.ok(result); 
        } catch (Exception e) {
            // Returns a 400 Bad Request if parsing or saving fails
            return ResponseEntity.badRequest().body("Failed to upload: " + e.getMessage());
        }
    }

    // NEW: Get all external lawyers
    @GetMapping
    public ResponseEntity<List<ExternalLawyerResponseDto>> getAllExternalLawyers() {
        return ResponseEntity.ok(lawyerDataService.getAllLawyers());
    }
}