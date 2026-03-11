<<<<<<< HEAD
package com.teamthree.legalaid.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "case_id", nullable = false)
    private Case case_;

    @Column(name = "profile_id", nullable = false)
    private Long profileId;

    @Column(name = "profile_type", nullable = false)
    private String profileType; 

    @Column(name = "match_score")
    private Integer matchScore;

    @Column(name = "status")
    private String status; 

    @Column(name = "match_date")
    private LocalDateTime matchDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
=======
package com.teamthree.legalaid.entity;

public class Match {

}
>>>>>>> branch 'team-three' of https://github.com/springboardmentor7777/legal-aid-matching-platform-b13.git
