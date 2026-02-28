package com.milestone.backend.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.milestone.backend.entity.LawyerDirectory;
import com.milestone.backend.entity.NgoDirectory;
import com.milestone.backend.repository.LawyerDirectoryRepository;
import com.milestone.backend.repository.NgoDirectoryRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final LawyerDirectoryRepository lawyerRepo;
    private final NgoDirectoryRepository ngoRepo;

    // ❌ REMOVED the no-arg constructor that was setting repos to null
    // @RequiredArgsConstructor generates the correct constructor automatically

    @Override
    public void run(String... args) {

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
        }
    }
}