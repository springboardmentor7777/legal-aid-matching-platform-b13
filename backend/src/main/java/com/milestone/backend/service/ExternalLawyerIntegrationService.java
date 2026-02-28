package com.milestone.backend.service;

import static org.hibernate.query.sqm.tree.SqmNode.log;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.milestone.backend.dto.ExternalLawyerDto;
import com.milestone.backend.entity.LawyerDirectory;
import com.milestone.backend.repository.LawyerDirectoryRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExternalLawyerIntegrationService {

    private final LawyerDirectoryRepository lawyerRepository;
    private final RestTemplate restTemplate;

    public void fetchAndSaveLawyers() {

        String url = "https://example.com/api/lawyers"; // Replace with real Bar Council endpoint

        ResponseEntity<ExternalLawyerDto[]> response =
                restTemplate.getForEntity(url, ExternalLawyerDto[].class);

        ExternalLawyerDto[] externalLawyers = response.getBody();

        if (externalLawyers == null) {
            log.warn("No lawyer data received from external source.");
            return;
        }

        for (ExternalLawyerDto dto : externalLawyers) {

            if (dto.getName() == null || dto.getCity() == null) {
                log.warn("Skipping invalid lawyer record.");
                continue;
            }

            String normalizedLocation = dto.getCity().trim().toUpperCase();

            boolean exists = lawyerRepository.existsByNameAndLocation(
                    dto.getName().trim(),
                    normalizedLocation
            );

            if (!exists) {

                LawyerDirectory lawyer = new LawyerDirectory();
                lawyer.setName(dto.getName().trim());
                lawyer.setExpertise(dto.getPracticeArea());
                lawyer.setLocation(normalizedLocation);
                lawyer.setVerified("Verified".equalsIgnoreCase(dto.getVerificationStatus()));
                lawyer.setOrganizationDetails("Imported from Bar Council");

                lawyerRepository.save(lawyer);
                log.info("Saved lawyer: {}", lawyer.getName());

            } else {
                log.info("Duplicate lawyer skipped: {}", dto.getName());
            }
        }
    }
}