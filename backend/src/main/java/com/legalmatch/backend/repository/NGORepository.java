package com.legalmatch.backend.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import com.legalmatch.backend.entity.NGO;

public interface NGORepository extends JpaRepository<NGO, Integer> {
}
