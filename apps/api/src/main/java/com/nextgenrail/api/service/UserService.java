package com.nextgenrail.api.service;

import com.nextgenrail.api.dto.AuthTokens;
import com.nextgenrail.api.model.User;
import com.nextgenrail.api.repository.UserRepository;
import com.nextgenrail.api.util.JwtTokenUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

/**
 * User service implementation
 * Handles user authentication, registration, and OTP operations
 */
@Service
public class UserService implements UserDetailsService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    
    @Autowired
    private EmailService emailService;
    
    @Value("${app.otp.expiration}")
    private long otpExpirationMs;
    
    @Value("${app.otp.length}")
    private int otpLength;
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByEmailIgnoreCase(email);
        
        if (user.isEmpty()) {
            logger.warn("User not found with email: {}", email);
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        
        return user.get();
    }
    
    /**
     * Register a new user or return existing user
     */
    public User registerUser(String email, String firstName, String lastName) {
        Optional<User> existingUser = userRepository.findByEmailIgnoreCase(email);
        
        if (existingUser.isPresent()) {
            logger.info("User already exists with email: {}", email);
            return existingUser.get();
        }
        
        User newUser = new User(email, firstName, lastName);
        newUser = userRepository.save(newUser);
        
        logger.info("New user registered with email: {}", email);
        return newUser;
    }
    
    /**
     * Generate and send OTP for user login
     */
    public void generateAndSendOtp(String email) {
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);
        
        if (userOpt.isEmpty()) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        
        User user = userOpt.get();
        
        // Generate OTP
        String otp = generateOtp();
        
        // Set OTP and expiration
        user.setCurrentOtp(otp);
        user.setOtpExpiresAt(LocalDateTime.now().plusSeconds(otpExpirationMs / 1000));
        
        userRepository.save(user);
        
        // Send OTP via email
        emailService.sendOtpEmail(email, otp, user.getFirstName());
        
        logger.info("OTP sent to email: {}", email);
    }
    
    /**
     * Verify OTP and return JWT tokens
     */
    public AuthTokens verifyOtpAndGenerateTokens(String email, String otp) {
        Optional<User> userOpt = userRepository.findByEmailAndValidOtp(
            email, otp, LocalDateTime.now());
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid or expired OTP");
        }
        
        User user = userOpt.get();
        
        // Clear OTP after successful verification
        user.setCurrentOtp(null);
        user.setOtpExpiresAt(null);
        
        // Generate JWT tokens
        String accessToken = jwtTokenUtil.generateToken(user);
        String refreshToken = jwtTokenUtil.generateRefreshToken(user);
        
        // Store refresh token
        user.setRefreshToken(refreshToken);
        user.setRefreshTokenExpiresAt(
            LocalDateTime.now().plusSeconds(jwtTokenUtil.getRefreshTokenExpirationTime() / 1000));
        
        userRepository.save(user);
        
        logger.info("User authenticated successfully: {}", email);
        
        return new AuthTokens(accessToken, refreshToken, user);
    }
    
    /**
     * Refresh access token using refresh token
     */
    public AuthTokens refreshToken(String refreshToken) {
        Optional<User> userOpt = userRepository.findByRefreshToken(refreshToken);
        
        if (userOpt.isEmpty() || !userOpt.get().isRefreshTokenValid()) {
            throw new RuntimeException("Invalid or expired refresh token");
        }
        
        User user = userOpt.get();
        
        // Generate new tokens
        String newAccessToken = jwtTokenUtil.generateToken(user);
        String newRefreshToken = jwtTokenUtil.generateRefreshToken(user);
        
        // Update refresh token
        user.setRefreshToken(newRefreshToken);
        user.setRefreshTokenExpiresAt(
            LocalDateTime.now().plusSeconds(jwtTokenUtil.getRefreshTokenExpirationTime() / 1000));
        
        userRepository.save(user);
        
        logger.info("Tokens refreshed for user: {}", user.getEmail());
        
        return new AuthTokens(newAccessToken, newRefreshToken, user);
    }
    
    /**
     * Update user profile
     */
    public User updateProfile(String userId, User updatedUser) {
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOpt.get();
        
        // Update allowed fields
        if (updatedUser.getFirstName() != null) {
            user.setFirstName(updatedUser.getFirstName());
        }
        if (updatedUser.getLastName() != null) {
            user.setLastName(updatedUser.getLastName());
        }
        if (updatedUser.getPhoneNumber() != null) {
            user.setPhoneNumber(updatedUser.getPhoneNumber());
        }
        if (updatedUser.getAddress() != null) {
            user.setAddress(updatedUser.getAddress());
        }
        
        return userRepository.save(user);
    }
    
    /**
     * Logout user by invalidating refresh token
     */
    public void logout(String email) {
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setRefreshToken(null);
            user.setRefreshTokenExpiresAt(null);
            userRepository.save(user);
            
            logger.info("User logged out: {}", email);
        }
    }
    
    /**
     * Generate random OTP
     */
    private String generateOtp() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        
        for (int i = 0; i < otpLength; i++) {
            otp.append(random.nextInt(10));
        }
        
        return otp.toString();
    }
    
    /**
     * Find user by ID
     */
    public Optional<User> findById(String userId) {
        return userRepository.findById(userId);
    }
    
    /**
     * Find user by email
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email);
    }
}