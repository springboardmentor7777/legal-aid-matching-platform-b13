package com.legalmatch.backend.controller;

import com.legalmatch.backend.dto.JurisdictionResponse;
import com.legalmatch.backend.entity.Jurisdiction;
import com.legalmatch.backend.repository.JurisdictionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/jurisdictions")
@RequiredArgsConstructor
public class JurisdictionController {

    private final JurisdictionRepository jurisdictionRepository;

    /**
     * GET /api/jurisdictions — returns all states with their cities and courts
     */
    @GetMapping
    public ResponseEntity<List<JurisdictionResponse>> getAllJurisdictions() {
        List<String> states = jurisdictionRepository.findDistinctStates();

        List<JurisdictionResponse> response = states.stream()
                .map(state -> {
                    List<String> cities = jurisdictionRepository.findDistinctCitiesByState(state);
                    List<String> courts = jurisdictionRepository
                            .findByStateOrderByCourtNameAsc(state)
                            .stream()
                            .map(Jurisdiction::getCourtName)
                            .collect(Collectors.toList());

                    return JurisdictionResponse.builder()
                            .state(state)
                            .cities(cities)
                            .courts(courts)
                            .build();
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/jurisdictions/{state} — returns cities and courts for a state
     */
    @GetMapping("/{state}")
    public ResponseEntity<JurisdictionResponse> getCourtsByState(@PathVariable String state) {
        List<String> cities = jurisdictionRepository.findDistinctCitiesByState(state);
        List<String> courts = jurisdictionRepository
                .findByStateOrderByCourtNameAsc(state)
                .stream()
                .map(Jurisdiction::getCourtName)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                JurisdictionResponse.builder()
                        .state(state)
                        .cities(cities)
                        .courts(courts)
                        .build()
        );
    }

    /**
     * GET /api/jurisdictions/{state}/{city} — returns courts for a specific city
     */
    @GetMapping("/{state}/{city}")
    public ResponseEntity<List<String>> getCourtsByStateAndCity(
            @PathVariable String state, @PathVariable String city) {
        List<String> courts = jurisdictionRepository
                .findByStateAndCityOrderByCourtNameAsc(state, city)
                .stream()
                .map(Jurisdiction::getCourtName)
                .collect(Collectors.toList());

        return ResponseEntity.ok(courts);
    }
}
