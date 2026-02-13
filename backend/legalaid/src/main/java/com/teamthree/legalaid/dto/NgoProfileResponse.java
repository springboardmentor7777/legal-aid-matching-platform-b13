package com.teamthree.legalaid.dto;

public class NgoProfileResponse {
    
	private Long id;
    private Long userId;
    private String organizationName;
    private String registrationNumber;
    
    public NgoProfileResponse(Long id, Long userId, String organizationName, String registrationNumber) {
        this.id = id;
        this.userId = userId;
        this.organizationName = organizationName;
        this.registrationNumber = registrationNumber;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getOrganizationName() {
        return organizationName;
    }
    
    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }
    
    public String getRegistrationNumber() {
        return registrationNumber;
    }
    
    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }
}