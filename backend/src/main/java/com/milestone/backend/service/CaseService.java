package com.milestone.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import com.milestone.backend.dto.CaseRequest;
import com.milestone.backend.dto.CaseResponse;
import com.milestone.backend.entity.Case;
import com.milestone.backend.entity.CaseStatus;
import com.milestone.backend.entity.Match;
import com.milestone.backend.entity.MatchStatus;
import com.milestone.backend.entity.Role;
import com.milestone.backend.entity.User;
import com.milestone.backend.entity.Match;
import com.milestone.backend.repository.CaseRepository;
import com.milestone.backend.repository.MatchRepository;
import com.milestone.backend.repository.UserRepository;


@Service
public class CaseService {

    @Autowired
    private UserRepository userRepository;

    private final CaseRepository caseRepository;

    // FIX: Injected MatchRepository so getPendingCases() and getCaseById() can
    // query match data to determine which lawyers can see which cases.
    private final MatchRepository matchRepository;

    public CaseService(CaseRepository caseRepository, MatchRepository matchRepository) {
        this.caseRepository = caseRepository;
        this.matchRepository = matchRepository;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Create a new case (Citizen only)
    // ─────────────────────────────────────────────────────────────────────────────
    public CaseResponse createCase(CaseRequest request, User user) {

        if (!user.getRole().equals(Role.CITIZEN)) {
            throw new RuntimeException("Only citizens can create cases");
        }

        Case newCase = new Case();
        newCase.setTitle(request.getTitle());
        newCase.setDescription(request.getDescription());
        newCase.setCategory(request.getCategory());

        newCase.setLocation(request.getLocation());
        newCase.setIncidentDate(request.getIncidentDate());
        newCase.setIncidentTime(request.getIncidentTime());
        newCase.setAdditionalNotes(request.getAdditionalNotes());
        newCase.setContactInfo(request.getContactInfo());
        newCase.setAttachment(request.getAttachment());

        // --- NEW FIELDS MAPPING ---
        newCase.setPersonName(request.getPersonName());
        newCase.setCustomCategory(request.getCustomCategory());
        newCase.setSubcategory(request.getSubcategory());
        newCase.setCurrentStatus(request.getCurrentStatus());
        newCase.setFirNumber(request.getFirNumber());
        newCase.setFirFile(request.getFirFile());
        newCase.setOtherLocation(request.getOtherLocation());
        newCase.setOtherRepresentative(request.getOtherRepresentative());
        newCase.setLegalDocuments(request.getLegalDocuments());
        // --------------------------

        newCase.setStatus(CaseStatus.SUBMITTED);
        newCase.setUser(user);

        Case saved = caseRepository.save(newCase);
        return mapToResponse(saved);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Get cases owned by the current user (Citizen sees their own cases)
    // ─────────────────────────────────────────────────────────────────────────────
    public List<CaseResponse> getMyCases(User user) {

        List<Case> cases = caseRepository.findByUserId(user.getId());

        return cases.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Get a case by ID
    //
    // FIX: The old implementation only allowed the case owner (Citizen) to view
    // a case. This meant that Lawyers/NGOs who had been matched to a case would
    // get a 403 when trying to view case details from their pending matches screen.
    //
    // Now we also allow access if the requesting user has an active (PENDING or
    // ACCEPTED) match record for this case, i.e. they are an assigned provider.
    // ─────────────────────────────────────────────────────────────────────────────
    public CaseResponse getCaseById(Long id, User user) {

        Case caseObj = caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        boolean isCaseOwner = caseObj.getUser().getId().equals(user.getId());

        // FIX: Allow matched Lawyers/NGOs to view the case so they can decide
        // whether to accept or reject the match. We check for any non-rejected
        // match record linking this provider to this case.
        boolean isMatchedProvider = (user.getRole() == Role.LAWYER || user.getRole() == Role.NGO)
                && matchRepository.existsByCaseIdAndUserIdAndStatusIn(
                        id,
                        user.getId(),
                        List.of(MatchStatus.PENDING, MatchStatus.ACCEPTED)
                   );

        if (!isCaseOwner && !isMatchedProvider) {
            throw new RuntimeException("Unauthorized access");
        }

        return mapToResponse(caseObj);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Mapper: Case entity → CaseResponse DTO
    // ─────────────────────────────────────────────────────────────────────────────
    private CaseResponse mapToResponse(Case caseObj) {
        CaseResponse response = new CaseResponse();
        response.setId(caseObj.getId());

        response.setSubmittedBy(caseObj.getUser().getName());

        response.setTitle(caseObj.getTitle());
        response.setDescription(caseObj.getDescription());
        response.setCategory(caseObj.getCategory());

        response.setLocation(caseObj.getLocation());
        response.setIncidentDate(caseObj.getIncidentDate());
        response.setIncidentTime(caseObj.getIncidentTime());
        response.setAdditionalNotes(caseObj.getAdditionalNotes());
        response.setContactInfo(caseObj.getContactInfo());
        response.setAttachment(caseObj.getAttachment());

        // --- ADDED TO RESPONSE ---
        response.setPersonName(caseObj.getPersonName());
        response.setCustomCategory(caseObj.getCustomCategory());
        response.setSubcategory(caseObj.getSubcategory());
        response.setCurrentStatus(caseObj.getCurrentStatus());
        response.setFirNumber(caseObj.getFirNumber());
        response.setFirFile(caseObj.getFirFile());
        response.setOtherLocation(caseObj.getOtherLocation());
        response.setOtherRepresentative(caseObj.getOtherRepresentative());
        response.setLegalDocuments(caseObj.getLegalDocuments());
        // -------------------------

        response.setStatus(caseObj.getStatus().name());
        response.setUpdatedAt(caseObj.getUpdatedAt());

        return response;
    }

    public CaseResponse updateStatus(Long id, CaseStatus status) {

        Case caseObj = caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        caseObj.setStatus(status);
        return mapToResponse(caseRepository.save(caseObj));
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Delete a case by ID (Citizen who owns the case only)
    // ─────────────────────────────────────────────────────────────────────────────
    public CaseResponse deleteCaseById(Long id, User user) {

        // 1. Find the case or throw
        Case caseObj = caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found with ID: " + id));

        // 2. Only the Citizen who created the case can delete it
        if (!caseObj.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access: You can only delete your own cases.");
        }

        // 3. Map to response before deleting so we can return the deleted data
        CaseResponse deletedCaseResponse = mapToResponse(caseObj);

        // 4. Delete from DB
        caseRepository.delete(caseObj);

        return deletedCaseResponse;
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Get all cases (Admin only — guarded by @PreAuthorize in the controller)
    // ─────────────────────────────────────────────────────────────────────────────
    public List<CaseResponse> getAllCases() {
        List<Case> cases = caseRepository.findAll();
        return cases.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Get cases pending the Lawyer/NGO's action
    //
    // FIX: The old implementation queried by requestedLawyerId and CaseStatus.IN_REVIEW.
    // Neither of these ever gets set in the current matching flow — the system never
    // sets IN_REVIEW status, so this always returned an empty list.
    //
    // New approach: look up the lawyer's PENDING match records and return the
    // corresponding cases. These are the cases where the Citizen has generated
    // matches and the lawyer appears in the results but hasn't been accepted yet.
    // ─────────────────────────────────────────────────────────────────────────────
    public List<CaseResponse> getPendingCases(User user) {

        // Fetch all match records for this provider that are still PENDING
        List<Long> pendingCaseIds = matchRepository
                .findByUserIdAndStatus(user.getId(), MatchStatus.PENDING)
                .stream()
                .map(match -> match.getCaseId())
                .distinct()
                .collect(Collectors.toList());

        // Fetch and return the corresponding Case objects
        return caseRepository.findAllById(pendingCaseIds)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Get cases that have been assigned to this Lawyer/NGO (ACCEPTED match)
    // ─────────────────────────────────────────────────────────────────────────────
    public List<CaseResponse> getAssignedCases(User user) {

        List<Case> cases = caseRepository
                .findByAssignedLawyerIdAndStatus(user.getId(), CaseStatus.ASSIGNED);

        return cases.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Get cases that have been resolved by this Lawyer/NGO
    // ─────────────────────────────────────────────────────────────────────────────
    public List<CaseResponse> getResolvedCases(User user) {

        List<Case> cases = caseRepository
                .findByAssignedLawyerIdAndStatus(user.getId(), CaseStatus.RESOLVED);

        return cases.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Accept a case (Lawyer/NGO directly accepts without going through matching)
    // This is a separate flow from match-based acceptance and sets the case
    // status to ASSIGNED and records the assignedLawyer.
    // ─────────────────────────────────────────────────────────────────────────────
    public CaseResponse acceptCase(Long id, User user) {

    // ✅ Role check
    if (!(user.getRole() == Role.LAWYER || user.getRole() == Role.NGO)) {
        throw new RuntimeException("Only lawyers/NGOs can accept cases");
    }

    // ✅ Get case
    Case caseObj = caseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Case not found"));

    // ❌ Prevent double assignment
    if (caseObj.getStatus() == CaseStatus.ASSIGNED) {
        throw new RuntimeException("Case already assigned");
    }

    // ✅ Get match (IMPORTANT)
    var match = matchRepository
            .findByCaseIdAndUserId(id, user.getId())
            .orElseThrow(() -> new RuntimeException("No match found for this case"));

    // ❌ Already handled
    if (match.getStatus() != MatchStatus.PENDING) {
        throw new RuntimeException("This case is no longer available");
    }

    // ✅ Accept match
    match.setStatus(MatchStatus.ACCEPTED);

    // ✅ Assign case
    caseObj.setAssignedLawyer(user);
    caseObj.setStatus(CaseStatus.ASSIGNED);

    List<Match> caseMatches = matchRepository.findByCaseId(id);
        for (Match m: caseMatches) {
            if (m.getUserId().equals(user.getId())) {
                m.setStatus(MatchStatus.ACCEPTED);
                matchRepository.save(m);
                break;
            }
        }
        
    return mapToResponse(caseRepository.save(caseObj));
}

    // ─────────────────────────────────────────────────────────────────────────────
    // Decline a case (Lawyer/NGO)
    // Records the decline reason and resets status to SUBMITTED so other
    // lawyers can still see and accept the case.
    // ─────────────────────────────────────────────────────────────────────────────
public CaseResponse declineCase(Long id, String reason, User user) {

    // ✅ Role check
    if (!(user.getRole() == Role.LAWYER || user.getRole() == Role.NGO)) {
        throw new RuntimeException("Only lawyers/NGOs can decline cases");
    }

    // ✅ Get case
    Case caseObj = caseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Case not found"));

    // ✅ Get match
    var match = matchRepository
            .findByCaseIdAndUserId(id, user.getId())
            .orElseThrow(() -> new RuntimeException("No match found for this case"));

    // ❌ Already handled
    if (match.getStatus() != MatchStatus.PENDING) {
        throw new RuntimeException("Already handled");
    }

    // ✅ Reject match
    match.setStatus(MatchStatus.REJECTED);

    // ✅ Optional reason
    caseObj.setDeclineReason(
            reason != null ? reason : "No reason provided"
    );

    matchRepository.save(match);
    caseRepository.save(caseObj);

    return mapToResponse(caseObj);
}
    // ─────────────────────────────────────────────────────────────────────────────
    // Request a specific lawyer for a case (Citizen-initiated direct request)
    // ─────────────────────────────────────────────────────────────────────────────
    public CaseResponse requestLawyer(Long caseId, Long lawyerId, User user) {

        if (user.getRole() != Role.CITIZEN) {
            throw new RuntimeException("Only citizens can request lawyers");
        }

        Case caseObj = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        if (!caseObj.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        User lawyer = new User();
        lawyer.setId(lawyerId); // Lightweight reference — no full fetch needed

        caseObj.setRequestedLawyer(lawyer);
        caseObj.setStatus(CaseStatus.SUBMITTED);

        return mapToResponse(caseRepository.save(caseObj));
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Update case details (Citizen who owns the case only)
    // ─────────────────────────────────────────────────────────────────────────────
    public CaseResponse updateCase(Long id, CaseRequest request, User user) {

        Case caseObj = caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        // Only the Citizen who created the case can edit it
        if (!caseObj.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        // Update editable fields
        caseObj.setTitle(request.getTitle());
        caseObj.setDescription(request.getDescription());
        caseObj.setLocation(request.getLocation());

        // Custom fields
        caseObj.setPersonName(request.getPersonName());
        caseObj.setContactInfo(request.getContactInfo());
        caseObj.setCurrentStatus(request.getCurrentStatus());
        caseObj.setFirNumber(request.getFirNumber());
        caseObj.setFirFile(request.getFirFile());

        // NOTE: Do NOT override the system-managed CaseStatus here —
        // that is controlled by acceptCase / declineCase / updateStatus only.

        Case updated = caseRepository.save(caseObj);
        return mapToResponse(updated);
    }
}
