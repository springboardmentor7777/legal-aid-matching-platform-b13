package com.milestone.backend.service;

import org.springframework.stereotype.Service;

import com.milestone.backend.dto.ExternalLawyerResponseDto;
// import com.milestone.backend.dto.ExternalLawyerResponseDto;
import com.milestone.backend.entity.ExternalLawyers;
import com.milestone.backend.repository.ExternalLawyersRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExternalLawyersDataService {

    private final ExternalLawyersRepository repo;

    public ExternalLawyersDataService(ExternalLawyersRepository repo) {
        this.repo = repo;
    }

    public Map<String, Object> saveUniqueLawyers(List<ExternalLawyers> lawyers) {
        int totalRows = lawyers.size();

        // 1. Internal De-duplication: Remove duplicate emails inside the Excel file
        Map<String, ExternalLawyers> uniqueInExcelMap = new HashMap<>();
        for (ExternalLawyers lawyer : lawyers) {
            if (lawyer.getEmail() != null) {
                uniqueInExcelMap.put(lawyer.getEmail().toLowerCase().trim(), lawyer);
            }
        }
        List<ExternalLawyers> uniqueInExcelList = new ArrayList<>(uniqueInExcelMap.values());

        // 2. Database Check: Find which of these already exist in our DB
        List<String> emailsToCheck = uniqueInExcelList.stream()
                .map(ExternalLawyers::getEmail)
                .collect(Collectors.toList());
        
        List<String> existingEmails = repo.findExistingEmails(emailsToCheck);
        Set<String> existingSet = new HashSet<>(existingEmails);

        // 3. Filtering: Keep only the truly new lawyers
        List<ExternalLawyers> newLawyers = uniqueInExcelList.stream()
                .filter(l -> !existingSet.contains(l.getEmail()))
                .collect(Collectors.toList());

        // 4. Batch Save
        repo.saveAll(newLawyers);

        // 5. Return Detailed Stats for the Admin Panel
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRowsProcessed", totalRows);
        stats.put("uniqueInExcel", uniqueInExcelList.size());
        stats.put("newlyInserted", newLawyers.size());
        stats.put("duplicatesSkipped", totalRows - newLawyers.size());
        return stats;
    }

    public List<ExternalLawyerResponseDto> getAllLawyers() {
        List<ExternalLawyers> lawyers = repo.findAll();

        return lawyers.stream()
                .map(l -> new ExternalLawyerResponseDto(
                        l.getId(),
                        l.getName(),
                        l.getEmail(),
                        l.getExperience(),
                        l.getIsVerified(),
                        l.getExpertise(),
                        l.getLocation()
                ))
                .collect(Collectors.toList());
    }
    
}