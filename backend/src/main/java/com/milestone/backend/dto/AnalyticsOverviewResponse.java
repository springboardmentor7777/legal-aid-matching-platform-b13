package com.milestone.backend.dto;

public class AnalyticsOverviewResponse {
    private long totalUsers;
    private long totalLawyers;
    private long totalNgos;
    private long totalCases;
    private long totalMatches;
    private long resolvedCases;

    // Getters and Setters
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalLawyers() { return totalLawyers; }
    public void setTotalLawyers(long totalLawyers) { this.totalLawyers = totalLawyers; }

    public long getTotalNgos() { return totalNgos; }
    public void setTotalNgos(long totalNgos) { this.totalNgos = totalNgos; }

    public long getTotalCases() { return totalCases; }
    public void setTotalCases(long totalCases) { this.totalCases = totalCases; }

    public long getTotalMatches() { return totalMatches; }
    public void setTotalMatches(long totalMatches) { this.totalMatches = totalMatches; }

    public long getResolvedCases() { return resolvedCases; }
    public void setResolvedCases(long resolvedCases) { this.resolvedCases = resolvedCases; }
}