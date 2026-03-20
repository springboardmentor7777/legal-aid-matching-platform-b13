package com.legalmatch.backend.service;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@Component
public class NGODataLoader {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void loadData() {
        try {
            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(
                            getClass().getResourceAsStream("/data/ngo_data.csv")
                    )
            );

            String line;
            boolean firstLine = true;

            while ((line = reader.readLine()) != null) {

                if (line.trim().isEmpty()) continue;

                // skip header
                if (firstLine) {
                    firstLine = false;
                    continue;
                }

                String[] data = line.split(",", -1);

                if (data.length < 5) {
                    System.out.println("Skipping invalid row: " + line);
                    continue;
                }

                String name = data[0].trim();
                String category = data[1].trim();
                String location = data[2].trim();
                String contact = data[3].trim();
                boolean verified = Boolean.parseBoolean(data[4].trim());

                jdbcTemplate.update(
                        "INSERT INTO ngo_directory (organization_name,focus_area, location, contact_info, verified) VALUES (?, ?, ?, ?, ?)",
                        name, category, location, contact, verified
                );
            }

            System.out.println("✅ NGO data loaded successfully!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
