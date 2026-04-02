package com.milestone.backend.entity;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
    name = "users",
    indexes = {
        @Index(name = "idx_users_roles", columnList = "role")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_users_email", columnNames = "email")
    }
)
public class User implements UserDetails {

    // ===== Primary Key =====
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ===== Basic Fields =====
    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    // ===== Role =====
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // ===== Timestamp =====
    @Column(name = "created_at", nullable = false)
    private LocalDateTime timeStamp = LocalDateTime.now();

    // ===== Verification =====
    @Column(name = "is_verified")
    private Boolean isVerified = null;

    // ✅ IMPORTANT: Add this field
    @Column(nullable = false)
    private Boolean enabled = true;

    // ===== Spring Security Methods =====

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    @JsonIgnore
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // ✅ FIXED: now depends on enabled
    @Override
    public boolean isAccountNonLocked() {
        return enabled;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // ✅ FIXED: now depends on enabled
    @Override
    public boolean isEnabled() {
        return enabled;
    }

    // ===== Profiles =====

    @JsonIgnoreProperties({"user"})
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private LawyerProfile lawyerProfile;

    @JsonIgnoreProperties({"user"})
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private NgoProfile ngoProfile;

    // ===== Utility Methods (Good for viva) =====

    public void verifyUser() {
        this.isVerified = true;
    }

    public void rejectUser() {
        this.isVerified = false;
    }

    public void disableUser() {
        this.enabled = false;
    }

    public void enableUser() {
        this.enabled = true;
    }
}