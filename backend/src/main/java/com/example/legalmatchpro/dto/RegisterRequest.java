package com.example.legalmatchpro.dto;

import com.example.legalmatchpro.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {

    private String name;
    private String email;
    private String password;
    private Role role;
}
