package com.teamthree.legalaid.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @GetMapping("/dashboard")

    public String userDashboard() {
        return "Welcome User";
    }

    @PostMapping("/create-case")
    public String createCase() {
        return "Case created successfully";
    }
}
