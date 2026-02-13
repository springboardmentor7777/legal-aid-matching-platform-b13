package com.teamthree.legalaid.dto;

import java.time.LocalDateTime;

public class UserProfileResponse {
    
	private Long id;
    private String fullName;
    private String email;
    private Integer roleId;
    private String provider;
    private LocalDateTime createdAt;
    
    public UserProfileResponse(Long id, String fullName, String email, Integer roleId, 
                               String provider, LocalDateTime createdAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.roleId = roleId;
        this.provider = provider;
        this.createdAt = createdAt;
    }
    
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public Integer getRoleId() {
        return roleId;
    }
    
    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }
    
    public String getProvider() {
        return provider;
    }
    
    public void setProvider(String provider) {
        this.provider = provider;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}