package com.legalmatch.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class JurisdictionResponse {

    private String state;
    private List<String> cities;
    private List<String> courts;
}
