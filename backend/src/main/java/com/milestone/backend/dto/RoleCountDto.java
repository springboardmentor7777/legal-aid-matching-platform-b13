package com.milestone.backend.dto;

import com.milestone.backend.entity.Role;

public class RoleCountDto {
    private Role role;
    private long count;

    public RoleCountDto(Role role, long count) {
        this.role = role;
        this.count = count;
    }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public long getCount() { return count; }
    public void setCount(long count) { this.count = count; }
}