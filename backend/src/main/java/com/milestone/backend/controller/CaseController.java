package com.milestone.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.milestone.backend.dto.CaseRequest;
import com.milestone.backend.dto.CaseResponse;
import com.milestone.backend.dto.DeclineRequest;
import com.milestone.backend.entity.User;
import com.milestone.backend.service.CaseService;

@RestController
@RequestMapping("/cases") //
public class CaseController {

    private final CaseService caseService;

    public CaseController(CaseService caseService) {
        this.caseService = caseService;
    }

    // POST /cases
    @PostMapping
    public CaseResponse createCase(@RequestBody CaseRequest request,
                                   @AuthenticationPrincipal User user) {
        return caseService.createCase(request, user);
    }

    // GET /cases/my
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('ADMIN','CITIZEN','LAWYER')")
    public List<CaseResponse> getMyCases(@AuthenticationPrincipal User user) {
        return caseService.getMyCases(user);
    }

    // GET /cases/{id}
    @GetMapping("/{id}")
    public CaseResponse getCase(@PathVariable Long id,
                                @AuthenticationPrincipal User user) {
        return caseService.getCaseById(id, user);
    }

    // DELETE /cases/{id}/delete
    @DeleteMapping("/{id}/delete")
    public CaseResponse deleteCase(@PathVariable Long id, 
                                   @AuthenticationPrincipal User user){
        return caseService.deleteCaseById(id, user);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')") // Restricts access to ADMIN role only
    public List<CaseResponse> getAllCases() {
        return caseService.getAllCases();
    }

    @GetMapping("/pending")
@PreAuthorize("hasAnyRole('LAWYER','NGO')")
public List<CaseResponse> getPendingCases(@AuthenticationPrincipal User user) {
    return caseService.getPendingCases(user);
}

@GetMapping("/assigned")
@PreAuthorize("hasAnyRole('LAWYER','NGO')")
public List<CaseResponse> getAssignedCases(@AuthenticationPrincipal User user) {
    return caseService.getAssignedCases(user);
}

@GetMapping("/resolved")
@PreAuthorize("hasAnyRole('LAWYER','NGO')")
public List<CaseResponse> getResolvedCases(@AuthenticationPrincipal User user) {
    return caseService.getResolvedCases(user);
}

@PostMapping("/{id}/accept")
@PreAuthorize("hasAnyRole('LAWYER','NGO')")
public CaseResponse acceptCase(@PathVariable Long id,
                               @AuthenticationPrincipal User user) {
    return caseService.acceptCase(id, user);
}

@PostMapping("/{id}/decline")
@PreAuthorize("hasAnyRole('LAWYER','NGO')")
public CaseResponse declineCase(@PathVariable Long id,
                                @RequestBody DeclineRequest request,
                                @AuthenticationPrincipal User user) {
    return caseService.declineCase(id, request.getReason(), user);
}
}
