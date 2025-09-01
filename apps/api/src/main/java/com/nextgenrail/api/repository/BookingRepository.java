package com.nextgenrail.api.repository;

import com.nextgenrail.api.model.Booking;
import com.nextgenrail.api.model.Train;
import com.nextgenrail.api.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Booking entity
 * Provides CRUD operations and custom queries for train bookings
 */
@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    
    /**
     * Find booking by PNR number
     */
    Optional<Booking> findByPnrNumberIgnoreCase(String pnrNumber);
    
    /**
     * Check if booking exists by PNR
     */
    boolean existsByPnrNumberIgnoreCase(String pnrNumber);
    
    /**
     * Find all bookings by user
     */
    List<Booking> findByUserOrderByBookedAtDesc(User user);
    
    /**
     * Find user bookings with pagination
     */
    Page<Booking> findByUserOrderByBookedAtDesc(User user, Pageable pageable);
    
    /**
     * Find bookings by user and status
     */
    List<Booking> findByUserAndStatusOrderByBookedAtDesc(User user, String status);
    
    /**
     * Find bookings by train
     */
    List<Booking> findByTrainOrderByBookedAtDesc(Train train);
    
    /**
     * Find bookings by travel date
     */
    List<Booking> findByTravelDateOrderByBookedAtDesc(LocalDate travelDate);
    
    /**
     * Find bookings by train and travel date
     */
    List<Booking> findByTrainAndTravelDateOrderByBookedAtDesc(Train train, LocalDate travelDate);
    
    /**
     * Find bookings by status
     */
    List<Booking> findByStatusOrderByBookedAtDesc(String status);
    
    /**
     * Find confirmed bookings
     */
    @Query("{ 'status': 'CONFIRMED' }")
    List<Booking> findConfirmedBookings();
    
    /**
     * Find cancelled bookings
     */
    @Query("{ 'status': 'CANCELLED' }")
    List<Booking> findCancelledBookings();
    
    /**
     * Find waitlisted bookings
     */
    @Query("{ 'status': 'WAITLISTED' }")
    List<Booking> findWaitlistedBookings();
    
    /**
     * Find bookings by date range
     */
    @Query("{ 'bookedAt': { '$gte': ?0, '$lte': ?1 } }")
    List<Booking> findBookingsBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Find recent bookings (last 30 days)
     */
    @Query("{ 'bookedAt': { '$gte': ?0 } }")
    List<Booking> findRecentBookings(LocalDateTime thirtyDaysAgo);
    
    /**
     * Find bookings for specific train and date (for availability calculation)
     */
    @Query("{ 'train': ?0, 'travelDate': ?1, 'status': { '$ne': 'CANCELLED' } }")
    List<Booking> findActiveBookingsForTrainAndDate(Train train, LocalDate travelDate);
    
    /**
     * Find bookings by station pair
     */
    @Query("{ 'sourceStationCode': ?0, 'destinationStationCode': ?1 }")
    List<Booking> findBookingsByStations(String sourceStationCode, String destinationStationCode);
    
    /**
     * Find pending payment bookings
     */
    @Query("{ 'isPaid': false, 'status': { '$ne': 'CANCELLED' } }")
    List<Booking> findPendingPaymentBookings();
    
    /**
     * Find refundable bookings
     */
    @Query("{ 'status': 'CANCELLED', 'refundAmount': { '$gt': 0 } }")
    List<Booking> findRefundableBookings();
    
    /**
     * Find bookings by quota type
     */
    @Query("{ 'quota': ?0 }")
    List<Booking> findByQuotaType(String quotaType);
    
    /**
     * Find bookings by class type
     */
    @Query("{ 'classType': ?0 }")
    List<Booking> findByClassType(String classType);
    
    /**
     * Revenue analytics queries
     */
    
    /**
     * Calculate total revenue for a date range
     */
    @Query(value = "{ 'bookedAt': { '$gte': ?0, '$lte': ?1 }, 'isPaid': true, 'status': { '$ne': 'CANCELLED' } }")
    List<Booking> findPaidBookingsBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Find top revenue generating trains
     */
    @Query("{ 'isPaid': true, 'status': { '$ne': 'CANCELLED' } }")
    List<Booking> findPaidBookingsForRevenue();
    
    /**
     * Count bookings by status
     */
    @Query(value = "{ 'status': ?0 }", count = true)
    long countByStatus(String status);
    
    /**
     * Count user's total bookings
     */
    long countByUser(User user);
    
    /**
     * Count bookings for train on specific date
     */
    @Query(value = "{ 'train': ?0, 'travelDate': ?1, 'status': { '$ne': 'CANCELLED' } }", count = true)
    long countActiveBookingsForTrainAndDate(Train train, LocalDate travelDate);
    
    /**
     * Find bookings that can be cancelled (within cancellation window)
     */
    @Query("{ " +
               "'travelDate': { '$gte': ?0 }, " +
               "'status': { '$in': ['CONFIRMED', 'RAC', 'WAITLISTED'] } " +
               "}")
    List<Booking> findCancellableBookings(LocalDate minTravelDate);
    
    /**
     * Find expired waitlist bookings that can be auto-cancelled
     */
    @Query("{ " +
               "'status': 'WAITLISTED', " +
               "'travelDate': { '$lt': ?0 } " +
               "}")
    List<Booking> findExpiredWaitlistBookings(LocalDate currentDate);
    
    /**
     * Find bookings for chart preparation (day before travel)
     */
    @Query("{ " +
               "'travelDate': ?0, " +
               "'status': { '$in': ['CONFIRMED', 'RAC', 'WAITLISTED'] } " +
               "}")
    List<Booking> findBookingsForChartPreparation(LocalDate travelDate);
}