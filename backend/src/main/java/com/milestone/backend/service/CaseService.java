package com.milestone.backend.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import com.milestone.backend.dto.CaseRequest;
import com.milestone.backend.dto.CaseResponse;
import com.milestone.backend.entity.Case;
import com.milestone.backend.entity.CaseStatus;
import com.milestone.backend.entity.Role;
import com.milestone.backend.entity.User;
import com.milestone.backend.repository.CaseRepository;

@Service
public class CaseService {

    private final CaseRepository caseRepository;

    public CaseService(CaseRepository caseRepository) {
        this.caseRepository = caseRepository;
    }

    // Create Case
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
    
    // Get My Cases
    public List<CaseResponse> getMyCases(User user) {

        List<Case> cases = caseRepository.findByUserId(user.getId());

        return cases.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get Case By ID
    public CaseResponse getCaseById(Long id, User user) {

        Case caseObj = caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        // Only owner can view
        if (!caseObj.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        return mapToResponse(caseObj);
    }

    // Mapper
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
        // --------------------------------------------------------------------------------------
        
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


    // Delete Case By ID
    public CaseResponse deleteCaseById(Long id, User user) {
        
        // 1. Find the case or throw an error
        Case caseObj = caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found with ID: " + id));

        // 2. Verify Ownership: Only the citizen who created the case can delete it
        if (!caseObj.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access: You can only delete your own cases.");
        }

        // 3. Map to response before deleting so we can return the deleted data to the user
        CaseResponse deletedCaseResponse = mapToResponse(caseObj);

        // 4. Delete the case from the database
        caseRepository.delete(caseObj);

        return deletedCaseResponse;
    }


    public List<CaseResponse> getAllCases() {
        // Fetch every case in the database
        List<Case> cases = caseRepository.findAll();

        // Map them to Response DTOs
        return cases.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<CaseResponse> getPendingCases(User user) {

    List<Case> cases = caseRepository
            .findByRequestedLawyerIdAndStatus(user.getId(), CaseStatus.IN_REVIEW);

    return cases.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
}
    public List<CaseResponse> getAssignedCases(User user) {

    List<Case> cases = caseRepository
            .findByAssignedLawyerIdAndStatus(user.getId(), CaseStatus.ASSIGNED);

    return cases.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
}

    public List<CaseResponse> getResolvedCases(User user) {

    List<Case> cases = caseRepository
            .findByAssignedLawyerIdAndStatus(user.getId(), CaseStatus.RESOLVED);

    return cases.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
}


    public CaseResponse acceptCase(Long id, User user) {

    if (!(user.getRole() == Role.LAWYER || user.getRole() == Role.NGO)) {
        throw new RuntimeException("Only lawyers/NGOs can accept cases");
    }

    Case caseObj = caseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Case not found"));

    // 🔥 Assign lawyer
    caseObj.setAssignedLawyer(user);

    // 🔥 Update status
    caseObj.setStatus(CaseStatus.ASSIGNED);

    return mapToResponse(caseRepository.save(caseObj));
}

    public CaseResponse declineCase(Long id, String reason, User user) {

    if (!(user.getRole() == Role.LAWYER || user.getRole() == Role.NGO)) {
        throw new RuntimeException("Only lawyers/NGOs can decline cases");
    }

    Case caseObj = caseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Case not found"));

    caseObj.setDeclineReason(reason);

    // 🔥 IMPORTANT: Keep case open for other lawyers
    caseObj.setStatus(CaseStatus.SUBMITTED);

    return mapToResponse(caseRepository.save(caseObj));
}

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
    lawyer.setId(lawyerId); // lightweight reference

    caseObj.setRequestedLawyer(lawyer);
    caseObj.setStatus(CaseStatus.SUBMITTED);

    return mapToResponse(caseRepository.save(caseObj));
}

public CaseResponse updateCase(Long id, CaseRequest request, User user) {

    Case caseObj = caseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Case not found"));

    // ✅ Only owner can update
    if (!caseObj.getUser().getId().equals(user.getId())) {
        throw new RuntimeException("Unauthorized access");
    }

    // ✅ Update fields
    caseObj.setTitle(request.getTitle());
    caseObj.setDescription(request.getDescription());
    caseObj.setLocation(request.getLocation());
    

    // 🔥 IMPORTANT (your custom fields)
    caseObj.setPersonName(request.getPersonName());
    caseObj.setContactInfo(request.getContactInfo());
    caseObj.setCurrentStatus(request.getCurrentStatus());
    caseObj.setFirNumber(request.getFirNumber());
    caseObj.setFirFile(request.getFirFile());

    // ❗ DO NOT override system status unless needed
    // caseObj.setStatus(...);

    Case updated = caseRepository.save(caseObj);

    return mapToResponse(updated);
}
}
