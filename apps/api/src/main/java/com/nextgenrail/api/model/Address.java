package com.nextgenrail.api.model;

/**
 * Address embedded document for user addresses
 */
public class Address {
    private String street;
    private String city;
    private String state;
    private String postalCode;
    private String country = "India";

    // Constructors
    public Address() {
    }

    public Address(String street, String city, String state, String postalCode) {
        this.street = street;
        this.city = city;
        this.state = state;
        this.postalCode = postalCode;
    }

    // Helper methods
    public String getFullAddress() {
        StringBuilder sb = new StringBuilder();
        if (street != null && !street.trim().isEmpty()) {
            sb.append(street).append(", ");
        }
        if (city != null && !city.trim().isEmpty()) {
            sb.append(city).append(", ");
        }
        if (state != null && !state.trim().isEmpty()) {
            sb.append(state).append(" ");
        }
        if (postalCode != null && !postalCode.trim().isEmpty()) {
            sb.append(postalCode);
        }
        return sb.toString();
    }

    // Getters and Setters
    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}