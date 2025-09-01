package com.nextgenrail.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.socket.config.annotation.EnableWebSocket;

/**
 * Main application class for IRCTC-Plus API
 *
 * Features enabled:
 * - Spring Boot auto-configuration
 * - MongoDB auditing for created/updated timestamps
 * - Caching with Caffeine for performance optimization
 * - Async processing for notifications and background tasks
 * - WebSocket support for real-time updates
 */
@SpringBootApplication
@EnableMongoAuditing
@EnableCaching
@EnableAsync
@EnableWebSocket
public class NextGenRailApiApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(NextGenRailApiApplication.class, args);
    }
}