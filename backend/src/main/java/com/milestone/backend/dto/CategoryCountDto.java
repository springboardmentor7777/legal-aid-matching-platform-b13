package com.milestone.backend.dto;

public class CategoryCountDto {
    private String category;
    private long count;

    // IMPORTANT: Spring Data JPA needs this exact constructor to map the SQL query
    public CategoryCountDto(String category, long count) {
        this.category = category;
        this.count = count;
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public long getCount() { return count; }
    public void setCount(long count) { this.count = count; }
}