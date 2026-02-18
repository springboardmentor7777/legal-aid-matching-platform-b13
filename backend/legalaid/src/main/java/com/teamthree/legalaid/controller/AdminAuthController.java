package com.teamthree.legalaid.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminAuthController {
	
	@Value("${admin.username}")
	private String adminUsername;
	
	@Value("${admin.password}")
	private String adminPassword;
	
	@PostMapping("/login")
	public Map<String,String> login(@RequestBody Map<String,String> request){
		
		String username = request.get("username");
		String password = request.get("password");
		
		if(adminUsername.equals(username) && adminPassword.equals(password)) {
			return Map.of(
					"status","success",
					"role","admin"
			);
		}
		
		return Map.of(
				"status","error",
				"role","admin"
		);
	}
}
