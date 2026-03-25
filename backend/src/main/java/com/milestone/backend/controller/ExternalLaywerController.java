package com.milestone.backend.controller;

// import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.milestone.backend.service.LawyerExcelService;
// import com.milestone.backend.dto.ExternalLawyerResponseDto;
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

    @PostMapping("/upload")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')") // Restrict to Admin Panel only
    public ResponseEntity<?> uploadExcel(@RequestParam("file") MultipartFile file) {
        try {
            // Parse using Apache POI
            var parsedLawyers = excelService.parseLawyerExcel(file.getInputStream());
            
            // Process and Save with de-duplication
            Map<String, Object> result = lawyerDataService.saveUniqueLawyers(parsedLawyers);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ingestion failed: " + e.getMessage());
        }
    }
}