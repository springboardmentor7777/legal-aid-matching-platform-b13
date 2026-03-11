package com.teamthree.legalaid.entity;

<<<<<<< HEAD
public class Notification {

}
=======
import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;
   
    private boolean read;

    private Long userId;

    private String type;
    
}
>>>>>>> 1105205 (Added notification APIs)
