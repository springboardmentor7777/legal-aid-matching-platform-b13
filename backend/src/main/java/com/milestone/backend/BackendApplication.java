package com.milestone.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
        System.out.println("hello world");
        // System.out.println("JJWT impl present: " +
        // io.jsonwebtoken.impl.DefaultJwtBuilder.class.getName());

    }

    @PostConstruct
    public void checkJjwt() {
        // System.out.println("JJWT impl class = " + io.jsonwebtoken.impl.DefaultJwtBuilder.class.getName());
    }
}
