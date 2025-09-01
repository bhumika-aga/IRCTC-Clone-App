package com.nextgenrail.api.controller;

import com.nextgenrail.api.model.Train;
import com.nextgenrail.api.repository.TrainRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/trains")
@Tag(name = "Trains", description = "Train search and management operations")
@CrossOrigin(origins = "*")
public class TrainController {
    
    private static final Logger logger = LoggerFactory.getLogger(TrainController.class);
    
    @Autowired
    private TrainRepository trainRepository;
    
    @GetMapping("/search")
    @Operation(summary = "Search trains between stations")
    public ResponseEntity<List<Train>> searchTrains(
        @RequestParam String fromStation,
        @RequestParam String toStation,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate journeyDate) {
        
        logger.info("Searching trains from {} to {} on {}", fromStation, toStation, journeyDate);
        
        try {
            List<Train> trains = trainRepository.findTrainsBetweenStations(
                fromStation.toUpperCase(),
                toStation.toUpperCase());
            
            // Filter by operational days
            String dayOfWeek = journeyDate.getDayOfWeek().name().substring(0, 3);
            trains = trains.stream()
                         .filter(train -> train.getOperationalDays().contains(dayOfWeek))
                         .toList();
            
            logger.info("Found {} trains for the route", trains.size());
            return ResponseEntity.ok(trains);
        } catch (Exception e) {
            logger.error("Error searching trains: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{trainNumber}")
    @Operation(summary = "Get train details by number")
    public ResponseEntity<Train> getTrainDetails(@PathVariable String trainNumber) {
        logger.info("Getting details for train {}", trainNumber);
        
        Optional<Train> train = trainRepository.findByTrainNumberIgnoreCase(trainNumber);
        
        if (train.isPresent()) {
            return ResponseEntity.ok(train.get());
        } else {
            logger.warn("Train not found: {}", trainNumber);
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping
    @Operation(summary = "Get all trains")
    public ResponseEntity<List<Train>> getAllTrains() {
        logger.info("Getting all trains");
        
        try {
            List<Train> trains = trainRepository.findAll();
            return ResponseEntity.ok(trains);
        } catch (Exception e) {
            logger.error("Error getting all trains: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }
}