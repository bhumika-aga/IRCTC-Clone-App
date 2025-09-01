package com.nextgenrail.api.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Train entity representing train schedules and information
 */
@Document(collection = "trains")
public class Train {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String trainNumber;
    
    private String trainName;
    private TrainType trainType;
    
    // Route information
    private List<TrainRoute> routes;
    
    // Operational information
    private List<String> operationalDays; // MON, TUE, WED, etc.
    private boolean isActive = true;
    
    // Coach configuration
    private Map<String, Integer> coachConfiguration; // AC1A: 2, AC2A: 4, etc.
    
    // Fare information
    private Map<String, Double> baseFarePerKm; // Base fare per km for each class
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // Constructors
    public Train() {
    }
    
    public Train(String trainNumber, String trainName, TrainType trainType) {
        this.trainNumber = trainNumber;
        this.trainName = trainName;
        this.trainType = trainType;
    }
    
    // Helper methods
    public TrainRoute getSourceStation() {
        return routes != null && !routes.isEmpty() ? routes.get(0) : null;
    }
    
    public TrainRoute getDestinationStation() {
        return routes != null && !routes.isEmpty() ? routes.get(routes.size() - 1) : null;
    }
    
    public boolean operatesOnDay(String day) {
        return operationalDays != null && operationalDays.contains(day.toUpperCase());
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getTrainNumber() {
        return trainNumber;
    }
    
    public void setTrainNumber(String trainNumber) {
        this.trainNumber = trainNumber;
    }
    
    public String getTrainName() {
        return trainName;
    }
    
    public void setTrainName(String trainName) {
        this.trainName = trainName;
    }
    
    public TrainType getTrainType() {
        return trainType;
    }
    
    public void setTrainType(TrainType trainType) {
        this.trainType = trainType;
    }
    
    public List<TrainRoute> getRoutes() {
        return routes;
    }
    
    public void setRoutes(List<TrainRoute> routes) {
        this.routes = routes;
    }
    
    public List<String> getOperationalDays() {
        return operationalDays;
    }
    
    public void setOperationalDays(List<String> operationalDays) {
        this.operationalDays = operationalDays;
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        isActive = active;
    }
    
    public Map<String, Integer> getCoachConfiguration() {
        return coachConfiguration;
    }
    
    public void setCoachConfiguration(Map<String, Integer> coachConfiguration) {
        this.coachConfiguration = coachConfiguration;
    }
    
    public Map<String, Double> getBaseFarePerKm() {
        return baseFarePerKm;
    }
    
    public void setBaseFarePerKm(Map<String, Double> baseFarePerKm) {
        this.baseFarePerKm = baseFarePerKm;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

