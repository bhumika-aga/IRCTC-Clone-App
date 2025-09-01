package com.nextgenrail.api.controller;

import com.nextgenrail.api.model.Station;
import com.nextgenrail.api.repository.StationRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/stations")
@Tag(name = "Stations", description = "Station search and information operations")
@CrossOrigin(origins = "*")
public class StationController {
    
    private static final Logger logger = LoggerFactory.getLogger(StationController.class);
    
    @Autowired
    private StationRepository stationRepository;
    
    @GetMapping("/search")
    @Operation(summary = "Search stations by name or city")
    public ResponseEntity<List<Station>> searchStations(@RequestParam String query) {
        logger.info("Searching stations for query: {}", query);
        
        try {
            List<Station> stations;
            if (query.length() >= 2) {
                stations = stationRepository.findBySearchQuery(query);
            } else {
                stations = List.of(); // Return empty list for short queries
            }
            
            logger.info("Found {} stations for query '{}'", stations.size(), query);
            return ResponseEntity.ok(stations);
        } catch (Exception e) {
            logger.error("Error searching stations: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{stationCode}")
    @Operation(summary = "Get station details by code")
    public ResponseEntity<Station> getStationByCode(@PathVariable String stationCode) {
        logger.info("Getting station details for code: {}", stationCode);
        
        Optional<Station> station = stationRepository.findByCodeIgnoreCase(stationCode.toUpperCase());
        
        if (station.isPresent()) {
            return ResponseEntity.ok(station.get());
        } else {
            logger.warn("Station not found: {}", stationCode);
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping
    @Operation(summary = "Get all active stations")
    public ResponseEntity<List<Station>> getAllStations() {
        logger.info("Getting all active stations");
        
        try {
            List<Station> stations = stationRepository.findByIsActiveTrue();
            return ResponseEntity.ok(stations);
        } catch (Exception e) {
            logger.error("Error getting stations: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/major")
    @Operation(summary = "Get major railway stations")
    public ResponseEntity<List<Station>> getMajorStations() {
        logger.info("Getting major railway stations");
        
        try {
            List<Station> stations = stationRepository.findByIsPrincipalStationTrueAndIsActiveTrue();
            return ResponseEntity.ok(stations);
        } catch (Exception e) {
            logger.error("Error getting major stations: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }
}