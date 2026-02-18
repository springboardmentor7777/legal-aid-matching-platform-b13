package com.teamthree.legalaid.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {

    @GetMapping("/public")
    public String publicEndpoint() {
        return "This is public - no token needed";
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER')")
    public String userEndpoint() {
        return "This is for USER role only";
    }

    @GetMapping("/lawyer")
    @PreAuthorize("hasRole('LAWYER')")
    public String lawyerEndpoint() {
        return "This is for LAWYER role only";
    }

    @GetMapping("/ngo")
    @PreAuthorize("hasRole('NGO')")
    public String ngoEndpoint() {
        return "This is for NGO role only";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminEndpoint() {
        return "This is for ADMIN role only";
    }
}