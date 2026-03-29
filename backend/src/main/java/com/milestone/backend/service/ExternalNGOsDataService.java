package com.milestone.backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

// import com.milestone.backend.dto.ExternalLawyerResponseDto;
import com.milestone.backend.dto.ExternalNGOResponseDto;
// import com.milestone.backend.entity.ExternalLawyers;
// import com.milestone.backend.entity.ExternalLawyers;
import com.milestone.backend.entity.ExternalNGOs;
import com.milestone.backend.repository.ExternalNGOsRepository;

@Service
public class ExternalNGOsDataService {

    private final ExternalNGOsRepository repo;

    public ExternalNGOsDataService(ExternalNGOsRepository repo){
        this.repo = repo;
    }

    public Map<String, Object> saveUniqueNgos(List<ExternalNGOs> ngos){

        int totalRows = ngos.size();
        Map<String, ExternalNGOs> uniqueInExcelMap = new HashMap<>();
        for (ExternalNGOs ngo : ngos) {
            if (ngo.getEmail() != null) {
                uniqueInExcelMap.put(ngo.getEmail().toLowerCase().trim(), ngo);
            }
        }
        List<ExternalNGOs> uniqueInExcelList = new ArrayList<>(uniqueInExcelMap.values());

        List<String> emailsToCheck = uniqueInExcelList.stream()
                .map(ExternalNGOs::getEmail)
                .collect(Collectors.toList());
        
        List<String> existingEmails = repo.findExistingEmails(emailsToCheck);
        Set<String> existingSet = new HashSet<>(existingEmails);

        List<ExternalNGOs> newNgos = uniqueInExcelList.stream()
                .filter(l -> !existingSet.contains(l.getEmail()))
                .collect(Collectors.toList());

        repo.saveAll(newNgos);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRowsProcessed", totalRows);
        stats.put("uniqueInExcel", uniqueInExcelList.size());
        stats.put("newlyInserted", newNgos.size());
        stats.put("duplicatesSkipped", totalRows - newNgos.size());
        return stats;

    }

    public List<ExternalNGOResponseDto> getAllNgos() {
        List<ExternalNGOs> ngos = repo.findAll();

        return ngos.stream()
                .map(n -> new ExternalNGOResponseDto(
                        n.getId(),
                        n.getName(),
                        n.getEmail(),
                        n.getIsVerified(),
                        n.getLocation(),
                        n.getOrganizationName(),
                        n.getServiceLocation()
                ))
                .collect(Collectors.toList());
    }
    
}
