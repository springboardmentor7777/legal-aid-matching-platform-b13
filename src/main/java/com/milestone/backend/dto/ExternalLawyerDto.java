package com.milestone.backend.dto;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ExternalLawyerDto {

    private String name;           
    private String city;           
    private String practiceArea;   
    private String verificationStatus; 
    private String barCouncilId;  
}
