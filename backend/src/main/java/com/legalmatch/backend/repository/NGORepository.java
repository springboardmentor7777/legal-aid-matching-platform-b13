package com.legalmatch.backend.repository;
import java.util.List;



import org.springframework.data.jpa.repository.JpaRepository;
import com.legalmatch.backend.entity.NGO;

public interface NGORepository extends JpaRepository<NGO, Integer> {
    

    List<NGO> findByLocationContainingIgnoreCase(String location);


}
