package com.nextgenrail.api.model;

/**
 * Booking status enumeration
 */
public enum BookingStatus {
    CONFIRMED, // Ticket is confirmed
    RAC, // Reservation Against Cancellation
    WAITLISTED, // In waiting list
    CANCELLED, // Booking cancelled
    CHART_PREPARED // Chart has been prepared for the journey
}