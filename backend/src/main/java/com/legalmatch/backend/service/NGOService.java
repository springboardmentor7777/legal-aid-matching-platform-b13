package com.legalmatch.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

import com.legalmatch.backend.entity.NGO;
import com.legalmatch.backend.repository.NGORepository;

@Service
@RequiredArgsConstructor
public class NGOService {

    private final NGORepository ngoRepository;

    // Get all NGOs
    public List<NGO> getAllNGOs() {
        return ngoRepository.findAll();
    }
    public List<NGO> getNGOsByLocation(String location) {
        return ngoRepository.findByLocationContainingIgnoreCase(location);
    }
    public List<NGO> getNGOsByCategory(String category) {
    return ngoRepository.findByCategoryContainingIgnoreCase(category);
}
}
