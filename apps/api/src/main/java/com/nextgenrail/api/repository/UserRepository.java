package com.nextgenrail.api.repository;

import com.nextgenrail.api.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Repository interface for User entity
 * Extends MongoRepository to provide CRUD operations
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    /**
     * Find user by email address (case-insensitive)
     */
    Optional<User> findByEmailIgnoreCase(String email);
    
    /**
     * Check if user exists by email
     */
    boolean existsByEmailIgnoreCase(String email);
    
    /**
     * Find user by Aadhaar number (encrypted)
     */
    Optional<User> findByAadhaarNumber(String aadhaarNumber);
    
    /**
     * Check if Aadhaar number is already registered
     */
    boolean existsByAadhaarNumber(String aadhaarNumber);
    
    /**
     * Find user by refresh token
     */
    Optional<User> findByRefreshToken(String refreshToken);
    
    /**
     * Find users with valid OTP
     */
    @Query("{ 'email': ?0, 'currentOtp': ?1, 'otpExpiresAt': { '$gt': ?2 } }")
    Optional<User> findByEmailAndValidOtp(String email, String otp, LocalDateTime now);
    
    /**
     * Find users with expired refresh tokens for cleanup
     */
    @Query("{ 'refreshTokenExpiresAt': { '$lt': ?0 } }")
    Iterable<User> findUsersWithExpiredRefreshTokens(LocalDateTime now);
    
    /**
     * Find users who haven't verified their Aadhaar
     */
    @Query("{ 'aadhaarVerified': false, 'aadhaarNumber': { '$ne': null } }")
    Iterable<User> findUsersWithUnverifiedAadhaar();
    
    /**
     * Count total registered users
     */
    @Query(value = "{}", count = true)
    long countTotalUsers();
    
    /**
     * Count users registered today
     */
    @Query(value = "{ 'createdAt': { '$gte': ?0, '$lt': ?1 } }", count = true)
    long countUsersRegisteredBetween(LocalDateTime startDate, LocalDateTime endDate);
}