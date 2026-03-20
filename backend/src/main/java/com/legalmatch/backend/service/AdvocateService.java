package com.legalmatch.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

import com.legalmatch.backend.entity.Advocate;
import com.legalmatch.backend.repository.AdvocateRepository;

@Service
@RequiredArgsConstructor
public class AdvocateService {

    private final AdvocateRepository advocateRepository;

    // Get all
    public List<Advocate> getAllAdvocates() {
        return advocateRepository.findAll();
    }

    // Search by location
    public List<Advocate> getAdvocatesByLocation(String location) {
        return advocateRepository.findByLocationContainingIgnoreCase(location);
    }

    // Search by specialization
    public List<Advocate> getAdvocatesBySpecialization(String specialization) {
        return advocateRepository.findBySpecializationContainingIgnoreCase(specialization);
    }

    // Filter both
    public List<Advocate> filterAdvocates(String location, String specialization) {
        return advocateRepository
                .findByLocationContainingIgnoreCaseAndSpecializationContainingIgnoreCase(
                        location, specialization);
    }
}