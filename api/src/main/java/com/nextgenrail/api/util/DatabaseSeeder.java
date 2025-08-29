package com.nextgenrail.api.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

/**
 * Database seeder utility
 * Seeds database with sample data on application startup in development mode
 */
@Component
@Profile("dev")
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public void run(String... args) throws Exception {
        logger.info("Starting database seeding for development environment...");
        
        try {
            // Check if data already exists
            long userCount = mongoTemplate.getCollection("users").countDocuments();
            long stationCount = mongoTemplate.getCollection("stations").countDocuments();
            long trainCount = mongoTemplate.getCollection("trains").countDocuments();
            
            if (userCount > 0 || stationCount > 0 || trainCount > 0) {
                logger.info("Database already contains data. Skipping seeding.");
                logger.info("Current counts - Users: {}, Stations: {}, Trains: {}", 
                           userCount, stationCount, trainCount);
                return;
            }
            
            logger.info("Database is empty. Please run the MongoDB init scripts to seed data:");
            logger.info("1. Make sure MongoDB is running");
            logger.info("2. Execute: make db-seed");
            logger.info("3. Or manually run the scripts in /infra/mongodb/init-scripts/");
            
        } catch (Exception e) {
            logger.error("Error during database seeding check: {}", e.getMessage());
        }
    }
}