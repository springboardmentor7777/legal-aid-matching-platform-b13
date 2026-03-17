package com.milestone.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.milestone.backend.dto.CaseRequest;
import com.milestone.backend.dto.CaseResponse;
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
}