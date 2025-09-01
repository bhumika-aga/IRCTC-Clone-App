package com.nextgenrail.api.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Station entity representing railway stations
 */
@Document(collection = "stations")
public class Station {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String code; // Station code like NDLS, CSMT, etc.
    
    @TextIndexed(weight = 2.0f)
    private String name; // Station name like "New Delhi"
    
    @TextIndexed
    private String city; // City name
    
    @Indexed
    private String state; // State name
    
    private String zone; // Railway zone (Northern Railway, Central Railway, etc.)
    
    // Geographic coordinates for location services
    private Coordinates coordinates;
    
    // Station metadata
    private boolean isActive = true;
    private boolean isPrincipalStation = false; // Major stations like terminals
    private boolean hasCarParking = false;
    private boolean hasWifi = false;
    private boolean hasRestaurant = false;
    private boolean hasWaitingRoom = false;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // Constructors
    public Station() {
    }
    
    public Station(String code, String name, String city, String state, String zone) {
        this.code = code;
        this.name = name;
        this.city = city;
        this.state = state;
        this.zone = zone;
    }
    
    public Station(String code, String name, String city, String state, String zone,
                   double latitude, double longitude) {
        this(code, name, city, state, zone);
        this.coordinates = new Coordinates(latitude, longitude);
    }
    
    // Helper methods
    public String getDisplayName() {
        return String.format("%s (%s)", name, code);
    }
    
    public boolean matchesSearch(String query) {
        if (query == null || query.trim().isEmpty()) {
            return false;
        }
        
        String lowerQuery = query.toLowerCase().trim();
        return name.toLowerCase().contains(lowerQuery) ||
                   code.toLowerCase().contains(lowerQuery) ||
                   city.toLowerCase().contains(lowerQuery);
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getCode() {
        return code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public String getState() {
        return state;
    }
    
    public void setState(String state) {
        this.state = state;
    }
    
    public String getZone() {
        return zone;
    }
    
    public void setZone(String zone) {
        this.zone = zone;
    }
    
    public Coordinates getCoordinates() {
        return coordinates;
    }
    
    public void setCoordinates(Coordinates coordinates) {
        this.coordinates = coordinates;
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        isActive = active;
    }
    
    public boolean isPrincipalStation() {
        return isPrincipalStation;
    }
    
    public void setPrincipalStation(boolean principalStation) {
        isPrincipalStation = principalStation;
    }
    
    public boolean isHasCarParking() {
        return hasCarParking;
    }
    
    public void setHasCarParking(boolean hasCarParking) {
        this.hasCarParking = hasCarParking;
    }
    
    public boolean isHasWifi() {
        return hasWifi;
    }
    
    public void setHasWifi(boolean hasWifi) {
        this.hasWifi = hasWifi;
    }
    
    public boolean isHasRestaurant() {
        return hasRestaurant;
    }
    
    public void setHasRestaurant(boolean hasRestaurant) {
        this.hasRestaurant = hasRestaurant;
    }
    
    public boolean isHasWaitingRoom() {
        return hasWaitingRoom;
    }
    
    public void setHasWaitingRoom(boolean hasWaitingRoom) {
        this.hasWaitingRoom = hasWaitingRoom;
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

/**
 * Geographic coordinates for location services
 */
class Coordinates {
    private double latitude;
    private double longitude;
    
    // Constructors
    public Coordinates() {
    }
    
    public Coordinates(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    
    // Helper methods
    public double distanceFromKm(Coordinates other) {
        if (other == null) {
            return Double.MAX_VALUE;
        }
        
        // Haversine formula for distance calculation
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(other.latitude - this.latitude);
        double lonDistance = Math.toRadians(other.longitude - this.longitude);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                       + Math.cos(Math.toRadians(this.latitude)) * Math.cos(Math.toRadians(other.latitude))
                             * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }
    
    // Getters and Setters
    public double getLatitude() {
        return latitude;
    }
    
    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }
    
    public double getLongitude() {
        return longitude;
    }
    
    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
}