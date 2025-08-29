package com.nextgenrail.api.controller;

import com.nextgenrail.api.dto.AuthRequest;
import com.nextgenrail.api.dto.AuthResponse;
import com.nextgenrail.api.dto.OtpRequest;
import com.nextgenrail.api.dto.RefreshTokenRequest;
import com.nextgenrail.api.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication controller
 * Handles user login, OTP verification, and token refresh
 */
@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "User authentication endpoints")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;

    /**
     * Initiate OTP-based login
     * Generates and sends OTP to user's email
     */
    @PostMapping("/otp-login")
    @Operation(summary = "Request OTP for login", description = "Generates and sends OTP to user's email address")
    public ResponseEntity<String> requestOtp(@Valid @RequestBody AuthRequest request) {
        try {
            // Register user if not exists, or get existing user
            userService.registerUser(request.getEmail(),
                    request.getFirstName(),
                    request.getLastName());

            // Generate and send OTP
            userService.generateAndSendOtp(request.getEmail());

            return ResponseEntity.ok("OTP sent successfully to " + request.getEmail());

        } catch (Exception e) {
            logger.error("Error during OTP login request for email: {}, error: {}",
                    request.getEmail(), e.getMessage());
            return ResponseEntity.badRequest()
                    .body("Failed to send OTP: " + e.getMessage());
        }
    }

    /**
     * Verify OTP and authenticate user
     * Returns JWT access and refresh tokens
     */
    @PostMapping("/verify-otp")
    @Operation(summary = "Verify OTP and login", description = "Verifies OTP and returns JWT tokens for authenticated user")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody OtpRequest request) {
        try {
            var authTokens = userService.verifyOtpAndGenerateTokens(
                    request.getEmail(),
                    request.getOtp());

            AuthResponse response = new AuthResponse(
                    authTokens.getAccessToken(),
                    authTokens.getRefreshToken(),
                    authTokens.getUser().getId(),
                    authTokens.getUser().getEmail(),
                    authTokens.getUser().getFullName(),
                    authTokens.getUser().isAadhaarVerified());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error during OTP verification for email: {}, error: {}",
                    request.getEmail(), e.getMessage());
            return ResponseEntity.badRequest()
                    .body("OTP verification failed: " + e.getMessage());
        }
    }

    /**
     * Refresh JWT access token
     * Uses refresh token to generate new access token
     */
    @PostMapping("/refresh-token")
    @Operation(summary = "Refresh access token", description = "Uses refresh token to generate new access and refresh tokens")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        try {
            var authTokens = userService.refreshToken(request.getRefreshToken());

            AuthResponse response = new AuthResponse(
                    authTokens.getAccessToken(),
                    authTokens.getRefreshToken(),
                    authTokens.getUser().getId(),
                    authTokens.getUser().getEmail(),
                    authTokens.getUser().getFullName(),
                    authTokens.getUser().isAadhaarVerified());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error during token refresh: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body("Token refresh failed: " + e.getMessage());
        }
    }

    /**
     * Logout user
     * Invalidates refresh token
     */
    @PostMapping("/logout")
    @Operation(summary = "Logout user", description = "Invalidates user's refresh token and logs them out")
    public ResponseEntity<String> logout(Authentication authentication) {
        try {
            if (authentication != null && authentication.getName() != null) {
                userService.logout(authentication.getName());
                return ResponseEntity.ok("Logged out successfully");
            } else {
                return ResponseEntity.badRequest().body("No active session found");
            }
        } catch (Exception e) {
            logger.error("Error during logout: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body("Logout failed: " + e.getMessage());
        }
    }

    /**
     * Get current user profile
     */
    @GetMapping("/profile")
    @Operation(summary = "Get user profile", description = "Returns current authenticated user's profile information")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            if (authentication != null && authentication.getName() != null) {
                var user = userService.findByEmail(authentication.getName());

                if (user.isPresent()) {
                    return ResponseEntity.ok(user.get());
                } else {
                    return ResponseEntity.notFound().build();
                }
            } else {
                return ResponseEntity.badRequest().body("Authentication required");
            }
        } catch (Exception e) {
            logger.error("Error getting user profile: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body("Failed to get profile: " + e.getMessage());
        }
    }
}