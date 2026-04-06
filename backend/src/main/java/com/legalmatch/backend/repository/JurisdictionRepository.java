package com.legalmatch.backend.repository;

import com.legalmatch.backend.entity.Jurisdiction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface JurisdictionRepository extends JpaRepository<Jurisdiction, Long> {

    @Query("SELECT DISTINCT j.state FROM Jurisdiction j ORDER BY j.state")
    List<String> findDistinctStates();

    List<Jurisdiction> findByStateOrderByCourtNameAsc(String state);

    @Query("SELECT DISTINCT j.city FROM Jurisdiction j WHERE j.state = ?1 ORDER BY j.city")
    List<String> findDistinctCitiesByState(String state);

    List<Jurisdiction> findByStateAndCityOrderByCourtNameAsc(String state, String city);
}
