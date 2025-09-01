package com.nextgenrail.api.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Booking entity representing train ticket reservations
 */
@Document(collection = "bookings")
public class Booking {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String pnrNumber;
    
    @DBRef
    private User user;
    
    @DBRef
    private Train train;
    
    // Journey details
    private String sourceStationCode;
    private String destinationStationCode;
    private LocalDate travelDate;
    private String classType; // AC1A, AC2A, AC3A, SL, CC, 2S
    
    // Booking details
    private BookingStatus status = BookingStatus.CONFIRMED;
    private QuotaType quota = QuotaType.GENERAL;
    private List<Passenger> passengers;
    private List<SeatAllocation> seatAllocations;
    
    // Payment details
    private double totalFare;
    private double convenienceFee;
    private double totalAmount;
    private boolean isPaid = false;
    
    // Cancellation details
    private LocalDateTime cancelledAt;
    private double cancellationCharges;
    private double refundAmount;
    private String cancellationReason;
    
    @CreatedDate
    private LocalDateTime bookedAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    // Constructors
    public Booking() {
        this.pnrNumber = generatePnrNumber();
    }
    
    public Booking(User user, Train train, String sourceStationCode, String destinationStationCode) {
        this();
        this.user = user;
        this.train = train;
        this.sourceStationCode = sourceStationCode;
        this.destinationStationCode = destinationStationCode;
    }
    
    // Helper methods
    private String generatePnrNumber() {
        // Generate 10-digit PNR number
        return String.valueOf(System.currentTimeMillis()).substring(3) +
                   String.valueOf(UUID.randomUUID().hashCode()).substring(1, 4);
    }
    
    public boolean isCancellable() {
        return status == BookingStatus.CONFIRMED || status == BookingStatus.RAC || status == BookingStatus.WAITLISTED;
    }
    
    public boolean isRefundable() {
        return status == BookingStatus.CANCELLED && refundAmount > 0;
    }
    
    public int getPassengerCount() {
        return passengers != null ? passengers.size() : 0;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getPnrNumber() {
        return pnrNumber;
    }
    
    public void setPnrNumber(String pnrNumber) {
        this.pnrNumber = pnrNumber;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Train getTrain() {
        return train;
    }
    
    public void setTrain(Train train) {
        this.train = train;
    }
    
    public String getSourceStationCode() {
        return sourceStationCode;
    }
    
    public void setSourceStationCode(String sourceStationCode) {
        this.sourceStationCode = sourceStationCode;
    }
    
    public String getDestinationStationCode() {
        return destinationStationCode;
    }
    
    public void setDestinationStationCode(String destinationStationCode) {
        this.destinationStationCode = destinationStationCode;
    }
    
    public LocalDate getTravelDate() {
        return travelDate;
    }
    
    public void setTravelDate(LocalDate travelDate) {
        this.travelDate = travelDate;
    }
    
    public String getClassType() {
        return classType;
    }
    
    public void setClassType(String classType) {
        this.classType = classType;
    }
    
    public BookingStatus getStatus() {
        return status;
    }
    
    public void setStatus(BookingStatus status) {
        this.status = status;
    }
    
    public QuotaType getQuota() {
        return quota;
    }
    
    public void setQuota(QuotaType quota) {
        this.quota = quota;
    }
    
    public List<Passenger> getPassengers() {
        return passengers;
    }
    
    public void setPassengers(List<Passenger> passengers) {
        this.passengers = passengers;
    }
    
    public List<SeatAllocation> getSeatAllocations() {
        return seatAllocations;
    }
    
    public void setSeatAllocations(List<SeatAllocation> seatAllocations) {
        this.seatAllocations = seatAllocations;
    }
    
    public double getTotalFare() {
        return totalFare;
    }
    
    public void setTotalFare(double totalFare) {
        this.totalFare = totalFare;
    }
    
    public double getConvenienceFee() {
        return convenienceFee;
    }
    
    public void setConvenienceFee(double convenienceFee) {
        this.convenienceFee = convenienceFee;
    }
    
    public double getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public boolean isPaid() {
        return isPaid;
    }
    
    public void setPaid(boolean paid) {
        isPaid = paid;
    }
    
    public LocalDateTime getCancelledAt() {
        return cancelledAt;
    }
    
    public void setCancelledAt(LocalDateTime cancelledAt) {
        this.cancelledAt = cancelledAt;
    }
    
    public double getCancellationCharges() {
        return cancellationCharges;
    }
    
    public void setCancellationCharges(double cancellationCharges) {
        this.cancellationCharges = cancellationCharges;
    }
    
    public double getRefundAmount() {
        return refundAmount;
    }
    
    public void setRefundAmount(double refundAmount) {
        this.refundAmount = refundAmount;
    }
    
    public String getCancellationReason() {
        return cancellationReason;
    }
    
    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }
    
    public LocalDateTime getBookedAt() {
        return bookedAt;
    }
    
    public void setBookedAt(LocalDateTime bookedAt) {
        this.bookedAt = bookedAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

