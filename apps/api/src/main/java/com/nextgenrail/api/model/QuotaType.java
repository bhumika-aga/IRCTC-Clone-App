package com.nextgenrail.api.model;

/**
 * Quota type enumeration for different reservation categories
 */
public enum QuotaType {
    GENERAL, // General quota
    TATKAL, // Tatkal (emergency booking)
    LADIES, // Ladies quota
    SENIOR_CITIZEN, // Senior citizen quota
    PHYSICALLY_HANDICAPPED, // Physically handicapped quota
    DEFENCE, // Defence personnel quota
    RAILWAY_EMPLOYEE // Railway employee quota
}