package com.teamthree.legalaid.dto;

public class LawyerProfileResponse {
    
	private Long id;
    private Long userId;
    private String specialization;
    private Integer experienceYears;
    
    public LawyerProfileResponse(Long id, Long userId, String specialization, Integer experienceYears) {
        this.id = id;
        this.userId = userId;
        this.specialization = specialization;
        this.experienceYears = experienceYears;
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
    
    public String getSpecialization() {
        return specialization;
    }
    
    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }
    
    public Integer getExperienceYears() {
        return experienceYears;
    }
    
    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }
}