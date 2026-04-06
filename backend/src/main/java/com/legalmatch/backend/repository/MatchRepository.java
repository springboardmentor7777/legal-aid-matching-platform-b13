package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.Case;
import com.legalmatch.backend.entity.MatchEntity;
import com.legalmatch.backend.entity.MatchStatus;
import com.legalmatch.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchRepository extends JpaRepository<MatchEntity, Long> {

    List<MatchEntity> findByCitizenOrderByMatchScoreDesc(User citizen);

    List<MatchEntity> findByProviderOrderByCreatedAtDesc(User provider);

    List<MatchEntity> findByCitizenOrProviderOrderByCreatedAtDesc(User citizen, User provider);

    List<MatchEntity> findByLegalCase(Case legalCase);

    long countByProviderAndStatus(User provider, MatchStatus status);

    long countByCitizenAndStatus(User citizen, MatchStatus status);

    List<MatchEntity> findByProviderAndStatusOrderByCreatedAtDesc(User provider, MatchStatus status);
}
