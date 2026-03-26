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
@RequestMapping("/cases")
public class CaseController {

    private final CaseService caseService;

    public CaseController(CaseService caseService) {
        this.caseService = caseService;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // POST /cases
    // Creates a new case. Role guard is enforced in CaseService (CITIZEN only).
    // ─────────────────────────────────────────────────────────────────────────────
    @PostMapping
    public CaseResponse createCase(@RequestBody CaseRequest request,
                                   @AuthenticationPrincipal User user) {
        return caseService.createCase(request, user);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET /cases/my
    // Returns all cases belonging to the authenticated user.
    // ─────────────────────────────────────────────────────────────────────────────
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('ADMIN','CITIZEN','LAWYER')")
    public List<CaseResponse> getMyCases(@AuthenticationPrincipal User user) {
        return caseService.getMyCases(user);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET /cases/{id}
    // Returns a case by ID.
    // FIX (in CaseService): Lawyers/NGOs who have an active match record for
    // this case can now view it. Previously only the Citizen owner could.
    // ─────────────────────────────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public CaseResponse getCase(@PathVariable Long id,
                                @AuthenticationPrincipal User user) {
        return caseService.getCaseById(id, user);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // DELETE /cases/{id}/delete
    // Deletes a case. Only the owning Citizen can delete their own case.
    // ─────────────────────────────────────────────────────────────────────────────
    @DeleteMapping("/{id}/delete")
    public CaseResponse deleteCase(@PathVariable Long id,
                                   @AuthenticationPrincipal User user) {
        return caseService.deleteCaseById(id, user);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET /cases/all
    // Returns every case in the system. Admin only.
    // ─────────────────────────────────────────────────────────────────────────────
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<CaseResponse> getAllCases() {
        return caseService.getAllCases();
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET /cases/pending
    // Returns cases where this Lawyer/NGO has a PENDING match (i.e. the Citizen
    // has generated matches and they appear in the results, awaiting acceptance).
    //
    // FIX (in CaseService): Was querying by requestedLawyerId + CaseStatus.IN_REVIEW,
    // which always returned empty because IN_REVIEW is never set in this flow.
    // Now correctly queries via MatchRepository for PENDING match records.
    // ─────────────────────────────────────────────────────────────────────────────
    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('LAWYER','NGO')")
    public List<CaseResponse> getPendingCases(@AuthenticationPrincipal User user) {
        return caseService.getPendingCases(user);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET /cases/assigned
    // Returns cases that are ASSIGNED to this Lawyer/NGO.
    // ─────────────────────────────────────────────────────────────────────────────
    @GetMapping("/assigned")
    @PreAuthorize("hasAnyRole('LAWYER','NGO')")
    public List<CaseResponse> getAssignedCases(@AuthenticationPrincipal User user) {
        return caseService.getAssignedCases(user);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GET /cases/resolved
    // Returns cases that have been RESOLVED by this Lawyer/NGO.
    // ─────────────────────────────────────────────────────────────────────────────
    @GetMapping("/resolved")
    @PreAuthorize("hasAnyRole('LAWYER','NGO')")
    public List<CaseResponse> getResolvedCases(@AuthenticationPrincipal User user) {
        return caseService.getResolvedCases(user);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // POST /cases/{id}/accept
    // Direct case acceptance by a Lawyer/NGO (outside the match flow).
    // Sets case status to ASSIGNED and records the assignedLawyer.
    // ─────────────────────────────────────────────────────────────────────────────
    @PostMapping("/{id}/accept")
    @PreAuthorize("hasAnyRole('LAWYER','NGO')")
    public CaseResponse acceptCase(@PathVariable Long id,
                                   @AuthenticationPrincipal User user) {
        return caseService.acceptCase(id, user);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // POST /cases/{id}/decline
    // Lawyer/NGO declines a case with a reason. Case status reverts to SUBMITTED
    // so other lawyers can still pick it up.
    // ─────────────────────────────────────────────────────────────────────────────
    @PostMapping("/{id}/decline")
    @PreAuthorize("hasAnyRole('LAWYER','NGO')")
    public CaseResponse declineCase(@PathVariable Long id,
                                    @RequestBody DeclineRequest request,
                                    @AuthenticationPrincipal User user) {
        return caseService.declineCase(id, request.getReason(), user);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // PUT /cases/{id}/update
    // Citizen (or Admin) can update editable fields on their own case.
    // System-managed fields like status and assignedLawyer are not touched here.
    // ─────────────────────────────────────────────────────────────────────────────
    @PutMapping("/{id}/update")
    @PreAuthorize("hasAnyRole('ADMIN','CITIZEN')")
    public CaseResponse updateCase(@PathVariable Long id,
                                   @RequestBody CaseRequest request,
                                   @AuthenticationPrincipal User user) {
        return caseService.updateCase(id, request, user);
    }
}
