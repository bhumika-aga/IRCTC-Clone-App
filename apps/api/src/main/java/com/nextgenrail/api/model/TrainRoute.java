package com.nextgenrail.api.model;

import java.time.LocalTime;

/**
 * Train route representing each station in the train's journey
 */
public class TrainRoute {
    private String stationCode;
    private String stationName;
    private LocalTime arrivalTime;
    private LocalTime departureTime;
    private int distanceFromSource; // in kilometers
    private int stopNumber; // sequence of the station in the route
    private int haltDurationMinutes = 0;
    private boolean isSourceStation = false;
    private boolean isDestinationStation = false;

    // Constructors
    public TrainRoute() {
    }

    public TrainRoute(String stationCode, String stationName, LocalTime arrivalTime,
            LocalTime departureTime, int distanceFromSource, int stopNumber) {
        this.stationCode = stationCode;
        this.stationName = stationName;
        this.arrivalTime = arrivalTime;
        this.departureTime = departureTime;
        this.distanceFromSource = distanceFromSource;
        this.stopNumber = stopNumber;
    }

    // Helper methods
    public boolean isStopStation() {
        return haltDurationMinutes > 0;
    }

    // Getters and Setters
    public String getStationCode() {
        return stationCode;
    }

    public void setStationCode(String stationCode) {
        this.stationCode = stationCode;
    }

    public String getStationName() {
        return stationName;
    }

    public void setStationName(String stationName) {
        this.stationName = stationName;
    }

    public LocalTime getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(LocalTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public LocalTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalTime departureTime) {
        this.departureTime = departureTime;
    }

    public int getDistanceFromSource() {
        return distanceFromSource;
    }

    public void setDistanceFromSource(int distanceFromSource) {
        this.distanceFromSource = distanceFromSource;
    }

    public int getStopNumber() {
        return stopNumber;
    }

    public void setStopNumber(int stopNumber) {
        this.stopNumber = stopNumber;
    }

    public int getHaltDurationMinutes() {
        return haltDurationMinutes;
    }

    public void setHaltDurationMinutes(int haltDurationMinutes) {
        this.haltDurationMinutes = haltDurationMinutes;
    }

    public boolean isSourceStation() {
        return isSourceStation;
    }

    public void setSourceStation(boolean sourceStation) {
        isSourceStation = sourceStation;
    }

    public boolean isDestinationStation() {
        return isDestinationStation;
    }

    public void setDestinationStation(boolean destinationStation) {
        isDestinationStation = destinationStation;
    }
}