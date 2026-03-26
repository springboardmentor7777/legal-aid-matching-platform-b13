package com.teamthree.legalaid.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;        
    private String username;     
    private String role;          
    private String details;       
    private String status;        

    private LocalDateTime timestamp;
}