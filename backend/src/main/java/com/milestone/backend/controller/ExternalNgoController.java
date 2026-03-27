package com.milestone.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

// import com.milestone.backend.dto.ExternalLawyerResponseDto;
import com.milestone.backend.dto.ExternalNGOResponseDto;
import com.milestone.backend.service.ExternalNGOsDataService;
import com.milestone.backend.service.NGOsExcelService;

@RestController
@RequestMapping("directory/external/ngos")
public class ExternalNgoController {

    private final ExternalNGOsDataService ngoservice;
    private final NGOsExcelService excelservice;
    
    public ExternalNgoController(ExternalNGOsDataService ngoservice, NGOsExcelService excelservice){
        this.ngoservice = ngoservice;
        this.excelservice = excelservice;
    }

    @PostMapping("/upload")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')") // Restrict to Admin Panel only
    public ResponseEntity<?> uploadExcel(@RequestParam("file") MultipartFile file) {
        try {
            // Parse using Apache POI
            var parsedngo = excelservice.parseNGOExcelData(file.getInputStream());
            
            // Process and Save with de-duplication
            Map<String, Object> result = ngoservice.saveUniqueNgos(parsedngo);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ingestion failed: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<ExternalNGOResponseDto>> getAllExternalNgos() {
        return ResponseEntity.ok(ngoservice.getAllNgos());
    }

}
