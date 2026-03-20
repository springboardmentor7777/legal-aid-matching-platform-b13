package com.legalmatch.backend.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@Component
@RequiredArgsConstructor
public class AdvocateDataLoader {

    private final JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void loadData() {
        try {
            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(
                            getClass().getResourceAsStream("/data/advocate_data.csv")
                    )
            );

            String line;
            boolean firstLine = true;

            while ((line = reader.readLine()) != null) {
                if(line.trim().isEmpty()){
                    continue;
                }

                if (firstLine) {
                    firstLine = false;
                    continue;
                }

                String[] data = line.split(",");
                if(data.length<5){
                    System.out.println("Skipping invalid row:"+line);
                    continue; 
                }

                String name = data[0];
                String specialization = data[1];
                String location = data[2];
                String contact = data[3];
                boolean verified = Boolean.parseBoolean(data[4]);

                jdbcTemplate.update(
                        "INSERT INTO advocate_directory (name, specialization, location, contact_info, verified) VALUES (?, ?, ?, ?, ?)",
                        name, specialization, location, contact, verified
                );
            }

            System.out.println("✅ Advocate data loaded successfully!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
