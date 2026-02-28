package com.milestone.backend.service;

import static org.hibernate.query.sqm.tree.SqmNode.log;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.milestone.backend.dto.ExternalNgoDto;
import com.milestone.backend.entity.NgoDirectory;
import com.milestone.backend.repository.NgoDirectoryRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExternalNgoIntegrationService {

    // ✅ FIXED: removed "= null" — @RequiredArgsConstructor injects these
    private final NgoDirectoryRepository ngoRepository;
    private final RestTemplate restTemplate;

    public void fetchAndSaveNgos() {

        String url = "https://example.com/api/ngos"; // Replace with real source

        ResponseEntity<ExternalNgoDto[]> response =
                restTemplate.getForEntity(url, ExternalNgoDto[].class);

        ExternalNgoDto[] externalNgos = response.getBody();

        if (externalNgos == null) {
            log.warn("No NGO data received from external source.");
            return;
        }

        for (ExternalNgoDto dto : externalNgos) {

            if (dto.getOrg_name() == null || dto.getCity() == null) {
                log.warn("Skipping invalid NGO record.");
                continue;
            }

            String normalizedLocation = dto.getCity().trim().toUpperCase();

            boolean exists = ngoRepository.existsByNameAndLocation(
                    dto.getOrg_name().trim(),
                    normalizedLocation
            );

            if (!exists) {

                NgoDirectory ngo = new NgoDirectory();
                ngo.setName(dto.getOrg_name().trim());
                ngo.setExpertise(dto.getFocus_area());
                ngo.setLocation(normalizedLocation);
                ngo.setVerified("Verified".equalsIgnoreCase(dto.getRegistration_status()));
                ngo.setOrganizationDetails("Imported from NGO Darpan");

                ngoRepository.save(ngo);
                log.info("Saved NGO: {}", ngo.getName());

            } else {
                // ✅ FIXED: removed wrong (Throwable) cast — just pass the String directly
                log.info("Duplicate NGO skipped: {}", dto.getOrg_name());
            }
        }
    }
}