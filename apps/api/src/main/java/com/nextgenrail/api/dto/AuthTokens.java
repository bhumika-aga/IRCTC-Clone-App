package com.nextgenrail.api.dto;

import com.nextgenrail.api.model.User;

/**
 * Authentication tokens response DTO
 */
public class AuthTokens {
    private String accessToken;
    private String refreshToken;
    private User user;
    
    public AuthTokens(String accessToken, String refreshToken, User user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = user;
    }
    
    // Getters
    public String getAccessToken() {
        return accessToken;
    }
    
    public String getRefreshToken() {
        return refreshToken;
    }
    
    public User getUser() {
        return user;
    }
}