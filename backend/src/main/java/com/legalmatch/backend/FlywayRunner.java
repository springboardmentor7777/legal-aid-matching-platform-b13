package com.legalmatch.backend;

import org.flywaydb.core.Flyway;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlywayRunner {

    @Bean
    public Flyway flyway() {
        Flyway flyway = Flyway.configure()
                .dataSource(
                        "jdbc:postgresql://localhost:5432/legal_system",
                        "legal_user",
                        "legal@321"
                )
                .locations("classpath:db/migration")
                .load();

        flyway.migrate();

        return flyway;
    }
}
