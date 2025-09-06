package com.nextgenrail.api.model;

/**
 * Passenger information embedded document
 */
public class Passenger {
    private String name;
    private int age;
    private String gender; // M, F, T
    private String berthPreference; // LOWER, MIDDLE, UPPER, SIDE_LOWER, SIDE_UPPER

    // Special categories
    private boolean isSeniorCitizen = false;
    private boolean isChild = false;
    private boolean isInfant = false;

    // Constructors
    public Passenger() {
    }

    public Passenger(String name, int age, String gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.isSeniorCitizen = age >= 60;
        this.isChild = age >= 5 && age < 12;
        this.isInfant = age < 5;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
        this.isSeniorCitizen = age >= 60;
        this.isChild = age >= 5 && age < 12;
        this.isInfant = age < 5;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getBerthPreference() {
        return berthPreference;
    }

    public void setBerthPreference(String berthPreference) {
        this.berthPreference = berthPreference;
    }

    public boolean isSeniorCitizen() {
        return isSeniorCitizen;
    }

    public void setSeniorCitizen(boolean seniorCitizen) {
        isSeniorCitizen = seniorCitizen;
    }

    public boolean isChild() {
        return isChild;
    }

    public void setChild(boolean child) {
        isChild = child;
    }

    public boolean isInfant() {
        return isInfant;
    }

    public void setInfant(boolean infant) {
        isInfant = infant;
    }
}