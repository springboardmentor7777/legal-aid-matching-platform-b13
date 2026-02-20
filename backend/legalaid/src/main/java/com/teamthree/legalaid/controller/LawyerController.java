package com.teamthree.legalaid.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/lawyer")
public class LawyerController {
	
	@GetMapping("/dashboard")
    public String lawyerDashboard() {
        return "Welcome Lawyer";
    }
	
	@GetMapping("/cases")
    public String viewAssignedCases() {
        return "List of assigned cases";
    }
	
}
