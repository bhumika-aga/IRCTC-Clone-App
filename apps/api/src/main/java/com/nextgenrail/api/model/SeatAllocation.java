package com.nextgenrail.api.model;

/**
 * Seat allocation for each passenger
 */
public class SeatAllocation {
    private String passengerName;
    private String coachNumber;
    private int seatNumber;
    private String berthType; // LOWER, MIDDLE, UPPER, etc.
    private BookingStatus allocationStatus;
    
    // Constructors
    public SeatAllocation() {
    }
    
    public SeatAllocation(String passengerName, String coachNumber, int seatNumber,
                          String berthType, BookingStatus allocationStatus) {
        this.passengerName = passengerName;
        this.coachNumber = coachNumber;
        this.seatNumber = seatNumber;
        this.berthType = berthType;
        this.allocationStatus = allocationStatus;
    }
    
    // Getters and Setters
    public String getPassengerName() {
        return passengerName;
    }
    
    public void setPassengerName(String passengerName) {
        this.passengerName = passengerName;
    }
    
    public String getCoachNumber() {
        return coachNumber;
    }
    
    public void setCoachNumber(String coachNumber) {
        this.coachNumber = coachNumber;
    }
    
    public int getSeatNumber() {
        return seatNumber;
    }
    
    public void setSeatNumber(int seatNumber) {
        this.seatNumber = seatNumber;
    }
    
    public String getBerthType() {
        return berthType;
    }
    
    public void setBerthType(String berthType) {
        this.berthType = berthType;
    }
    
    public BookingStatus getAllocationStatus() {
        return allocationStatus;
    }
    
    public void setAllocationStatus(BookingStatus allocationStatus) {
        this.allocationStatus = allocationStatus;
    }
}