package com.teamthree.legalaid.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecentUserDTO {
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private LocalDateTime registeredDate;
}