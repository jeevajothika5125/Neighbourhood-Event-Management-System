package com.examly.springapp.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import javax.sql.DataSource;
import java.sql.Connection;

@Configuration
public class DatabaseConfig {

    @Bean
    CommandLineRunner testDatabaseConnection(DataSource dataSource) {
        return args -> {
            try (Connection connection = dataSource.getConnection()) {
                System.out.println("✅ DATABASE CONNECTION SUCCESSFUL!");
                System.out.println("📊 Database URL: " + connection.getMetaData().getURL());
                System.out.println("🏢 Database Product: " + connection.getMetaData().getDatabaseProductName());
                System.out.println("🔢 Database Version: " + connection.getMetaData().getDatabaseProductVersion());
                System.out.println("🎯 Backend is ready for frontend connection!");
            } catch (Exception e) {
                System.err.println("❌ DATABASE CONNECTION FAILED: " + e.getMessage());
            }
        };
    }
}