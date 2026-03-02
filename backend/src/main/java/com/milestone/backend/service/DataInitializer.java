package com.milestone.backend.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.milestone.backend.entity.LawyerDirectory;
import com.milestone.backend.entity.NgoDirectory;
import com.milestone.backend.repository.LawyerDirectoryRepository;
import com.milestone.backend.repository.NgoDirectoryRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j  // ✅ this enables log.info() properly
public class DataInitializer implements CommandLineRunner {

    private final LawyerDirectoryRepository lawyerRepo;
    private final NgoDirectoryRepository ngoRepo;
    private final ExternalNgoIntegrationService externalNgoService; // ✅ was missing

    @Override
    public void run(String... args) {

        log.info("DataInitializer started.");
        log.info("Current NGO count in DB: {}", String.valueOf(ngoRepo.count())); // ✅ cast to String

        if (lawyerRepo.count() == 0) {

            lawyerRepo.save(new LawyerDirectory(
                    null,
                    "Rahul Sharma",
                    "Criminal Law",
                    "Mumbai",
                    true,
                    "Bar Council Verified Lawyer"
            ));

            lawyerRepo.save(new LawyerDirectory(
                    null,
                    "Priya Mehta",
                    "Family Law",
                    "Delhi",
                    true,
                    "10+ years experience"
            ));
        }

        if (ngoRepo.count() == 0) {
            log.info("NGO table is empty — starting import.");

            // ✅ Load all 105 NGOs from Excel
            externalNgoService.fetchAndSaveNgos();

            // Manual seed entries
            ngoRepo.save(new NgoDirectory(
                    null,
                    "Justice For All",
                    "Women Rights",
                    "Pune",
                    true,
                    "NGO Darpan Registered"
            ));

            ngoRepo.save(new NgoDirectory(
                    null,
                    "Legal Aid Foundation",
                    "Property Disputes",
                    "Nagpur",
                    false,
                    "Pending verification"
            ));

            log.info("NGO import complete. Total records: {}", String.valueOf(ngoRepo.count())); // ✅ cast to String

        } else {
            log.info("NGO table already has {} records — skipping import.", String.valueOf(ngoRepo.count())); // ✅ cast to String
        }
    }
}
