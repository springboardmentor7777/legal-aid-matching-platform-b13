package com.milestone.backend.service;

import org.springframework.stereotype.Service;
import com.milestone.backend.dto.ExternalLawyerResponseDto;
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

        int total = lawyers.size();

        // Step 1: Remove duplicates inside Excel itself
        Map<String, ExternalLawyers> uniqueMap = new HashMap<>();
        for (ExternalLawyers lawyer : lawyers) {
            if (lawyer.getEmail() != null) {
                uniqueMap.put(lawyer.getEmail(), lawyer);
            }
        }

        List<ExternalLawyers> uniqueLawyers = new ArrayList<>(uniqueMap.values());

        // Step 2: Extract emails
        List<String> emails = uniqueLawyers.stream()
                .map(ExternalLawyers::getEmail)
                .collect(Collectors.toList());

        // Step 3: Fetch existing emails from DB
        List<String> existingEmails = repo.findExistingEmails(emails);
        Set<String> existingSet = new HashSet<>(existingEmails);

        // Step 4: Filter new records only
        List<ExternalLawyers> newLawyers = uniqueLawyers.stream()
                .filter(l -> !existingSet.contains(l.getEmail()))
                .collect(Collectors.toList());

        // Step 5: Save only new ones
        repo.saveAll(newLawyers);

        // Step 6: Return stats
        Map<String, Object> response = new HashMap<>();
        response.put("totalRows", total);
        response.put("uniqueInExcel", uniqueLawyers.size());
        response.put("inserted", newLawyers.size());
        response.put("duplicatesSkipped", total - newLawyers.size());

        return response;
    }

    // --- NEW METHOD TO GET ALL LAWYERS ---
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