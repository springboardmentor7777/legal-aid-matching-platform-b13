package com.legalmatch.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.legalmatch.backend.entity.NGO;
import com.legalmatch.backend.service.NGOService;

@RestController
@RequestMapping("/api/ngos")
@RequiredArgsConstructor
public class NGOController {

    private final NGOService ngoService;

    @GetMapping
    public List<NGO> getAllNGOs() {
        return ngoService.getAllNGOs();
    }
    @GetMapping("/search")
public List<NGO> searchByLocation(@RequestParam String location) {
    return ngoService.getNGOsByLocation(location);
}
@GetMapping("/category")
public List<NGO> searchByCategory(@RequestParam String category) {
    return ngoService.getNGOsByCategory(category);
}
}
