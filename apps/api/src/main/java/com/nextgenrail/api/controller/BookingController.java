package com.nextgenrail.api.controller;

import com.nextgenrail.api.model.Booking;
import com.nextgenrail.api.model.BookingStatus;
import com.nextgenrail.api.model.Train;
import com.nextgenrail.api.model.User;
import com.nextgenrail.api.repository.BookingRepository;
import com.nextgenrail.api.repository.TrainRepository;
import com.nextgenrail.api.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/bookings")
@Tag(name = "Bookings", description = "Ticket booking and management operations")
@CrossOrigin(origins = "*")
public class BookingController {

    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TrainRepository trainRepository;

    @PostMapping
    @Operation(summary = "Create a new booking")
    public ResponseEntity<Booking> createBooking(@RequestBody Booking bookingRequest) {
        logger.info("Creating new booking for train {}",
                bookingRequest.getTrain() != null ? bookingRequest.getTrain().getTrainNumber() : "unknown");

        try {
            // Generate PNR number
            String pnr = generatePNR();
            bookingRequest.setPnrNumber(pnr);
            bookingRequest.setStatus(BookingStatus.CONFIRMED);
            bookingRequest.setBookedAt(LocalDateTime.now());
            bookingRequest.setUpdatedAt(LocalDateTime.now());

            // Calculate total fare (simplified calculation)
            if (bookingRequest.getTotalFare() == 0.0) {
                bookingRequest.setTotalFare(calculateFare(bookingRequest));
            }

            Booking savedBooking = bookingRepository.save(bookingRequest);
            logger.info("Booking created successfully with PNR: {}", pnr);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedBooking);
        } catch (Exception e) {
            logger.error("Error creating booking: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/pnr/{pnrNumber}")
    @Operation(summary = "Get booking details by PNR")
    public ResponseEntity<Booking> getBookingByPNR(@PathVariable String pnrNumber) {
        logger.info("Fetching booking for PNR: {}", pnrNumber);

        Optional<Booking> booking = bookingRepository.findByPnrNumberIgnoreCase(pnrNumber.toUpperCase());

        if (booking.isPresent()) {
            return ResponseEntity.ok(booking.get());
        } else {
            logger.warn("Booking not found for PNR: {}", pnrNumber);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userEmail}")
    @Operation(summary = "Get user bookings by email")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable String userEmail) {
        logger.info("Fetching bookings for user: {}", userEmail);

        try {
            Optional<User> userOptional = userRepository.findByEmailIgnoreCase(userEmail);
            if (userOptional.isPresent()) {
                List<Booking> bookings = bookingRepository.findByUserOrderByBookedAtDesc(userOptional.get());
                return ResponseEntity.ok(bookings);
            } else {
                logger.warn("User not found: {}", userEmail);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error fetching user bookings: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{pnrNumber}/cancel")
    @Operation(summary = "Cancel a booking")
    public ResponseEntity<Booking> cancelBooking(@PathVariable String pnrNumber) {
        logger.info("Cancelling booking with PNR: {}", pnrNumber);

        try {
            Optional<Booking> optionalBooking = bookingRepository.findByPnrNumberIgnoreCase(pnrNumber.toUpperCase());

            if (optionalBooking.isPresent()) {
                Booking booking = optionalBooking.get();

                // Check if booking can be cancelled
                if (booking.getStatus() == BookingStatus.CANCELLED) {
                    return ResponseEntity.badRequest().build();
                }

                // Check journey date for cancellation policy
                LocalDate journeyDate = booking.getTravelDate();
                if (journeyDate.isBefore(LocalDate.now())) {
                    return ResponseEntity.badRequest().build();
                }

                booking.setStatus(BookingStatus.CANCELLED);
                booking.setUpdatedAt(LocalDateTime.now());

                Booking cancelledBooking = bookingRepository.save(booking);
                logger.info("Booking cancelled successfully: {}", pnrNumber);

                return ResponseEntity.ok(cancelledBooking);
            } else {
                logger.warn("Booking not found for cancellation: {}", pnrNumber);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error cancelling booking: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/train/{trainNumber}")
    @Operation(summary = "Get bookings for a specific train")
    public ResponseEntity<List<Booking>> getBookingsByTrain(
            @PathVariable String trainNumber,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate journeyDate) {

        logger.info("Fetching bookings for train {} on {}", trainNumber, journeyDate);

        try {
            Optional<Train> trainOptional = trainRepository.findByTrainNumberIgnoreCase(trainNumber);
            if (trainOptional.isPresent()) {
                List<Booking> bookings = bookingRepository.findByTrainAndTravelDateOrderByBookedAtDesc(
                        trainOptional.get(), journeyDate);
                return ResponseEntity.ok(bookings);
            } else {
                logger.warn("Train not found: {}", trainNumber);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error fetching train bookings: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    private String generatePNR() {
        // Generate 10-digit PNR number
        Random random = new Random();
        StringBuilder pnr = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            pnr.append(random.nextInt(10));
        }
        return pnr.toString();
    }

    private Double calculateFare(Booking booking) {
        // Simplified fare calculation
        // In real implementation, this would consider distance, class, quota, etc.
        int passengerCount = booking.getPassengers() != null ? booking.getPassengers().size() : 1;
        return passengerCount * 500.0; // Base fare per passenger
    }
}