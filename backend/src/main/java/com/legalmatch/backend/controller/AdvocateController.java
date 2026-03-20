package com.legalmatch.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.legalmatch.backend.entity.Advocate;
import com.legalmatch.backend.service.AdvocateService;

@RestController
@RequestMapping("/api/advocates")
@RequiredArgsConstructor
public class AdvocateController {

    private final AdvocateService advocateService;

    // Get all
    @GetMapping
    public List<Advocate> getAll() {
        return advocateService.getAllAdvocates();
    }

    // Search by location
    @GetMapping("/search")
    public List<Advocate> searchByLocation(@RequestParam String location) {
        return advocateService.getAdvocatesByLocation(location);
    }

    // Search by specialization
    @GetMapping("/specialization")
    public List<Advocate> searchBySpecialization(@RequestParam String specialization) {
        return advocateService.getAdvocatesBySpecialization(specialization);
    }

    // Filter both
    @GetMapping("/filter")
    public List<Advocate> filter(
            @RequestParam String location,
            @RequestParam String specialization) {

        return advocateService.filterAdvocates(location, specialization);
    }
}