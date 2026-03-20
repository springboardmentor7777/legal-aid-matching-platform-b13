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

}