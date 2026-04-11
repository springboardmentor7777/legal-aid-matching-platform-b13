package com.legalmatch.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

import com.legalmatch.backend.entity.Advocate;
import com.legalmatch.backend.repository.AdvocateRepository;

/**
 * Service layer for querying the advocate directory.
 */
@Service
@RequiredArgsConstructor
public class AdvocateService {

    private final AdvocateRepository advocateRepository;

    public List<Advocate> getAllAdvocates() {
        return advocateRepository.findAll();
    }

    public List<Advocate> getAdvocatesByLocation(String location) {
        return advocateRepository.findByLocationContainingIgnoreCase(location);
    }

    public List<Advocate> getAdvocatesBySpecialization(String specialization) {
        return advocateRepository.findBySpecializationContainingIgnoreCase(specialization);
    }

    public List<Advocate> filterAdvocates(String location, String specialization) {
        return advocateRepository
                .findByLocationContainingIgnoreCaseAndSpecializationContainingIgnoreCase(
                        location, specialization);
    }
}