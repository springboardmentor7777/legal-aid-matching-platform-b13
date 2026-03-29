package com.milestone.backend.dto;

import com.milestone.backend.entity.MatchStatus;

public class MatchStatusCountDto {
    private MatchStatus status;
    private long count;

    public MatchStatusCountDto(MatchStatus status, long count) {
        this.status = status;
        this.count = count;
    }

    public MatchStatus getStatus() { return status; }
    public void setStatus(MatchStatus status) { this.status = status; }

    public long getCount() { return count; }
    public void setCount(long count) { this.count = count; }
}