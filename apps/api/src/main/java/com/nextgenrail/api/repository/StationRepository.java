package com.nextgenrail.api.repository;

import com.nextgenrail.api.model.Station;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Station entity
 * Provides CRUD operations and custom queries for railway stations
 */
@Repository
public interface StationRepository extends MongoRepository<Station, String> {

    /**
     * Find station by station code
     */
    Optional<Station> findByCodeIgnoreCase(String code);

    /**
     * Check if station exists by code
     */
    boolean existsByCodeIgnoreCase(String code);

    /**
     * Find stations by state
     */
    List<Station> findByStateIgnoreCase(String state);

    /**
     * Find stations by zone
     */
    List<Station> findByZoneIgnoreCase(String zone);

    /**
     * Find active stations only
     */
    List<Station> findByIsActiveTrue();

    /**
     * Find principal/major stations
     */
    List<Station> findByIsPrincipalStationTrueAndIsActiveTrue();

    /**
     * Text search across station name, city, and code
     * Uses MongoDB text index for fuzzy matching
     */
    @Query("{ '$text': { '$search': ?0 } }")
    List<Station> findByTextSearch(String searchText);

    /**
     * Find stations by name pattern (case-insensitive)
     */
    List<Station> findByNameIgnoreCaseContaining(String name);

    /**
     * Find stations by city pattern (case-insensitive)
     */
    List<Station> findByCityIgnoreCaseContaining(String city);

    /**
     * Complex search combining name, code, and city
     */
    @Query("{ '$or': [ " +
            "  { 'name': { '$regex': ?0, '$options': 'i' } }, " +
            "  { 'code': { '$regex': ?0, '$options': 'i' } }, " +
            "  { 'city': { '$regex': ?0, '$options': 'i' } } " +
            "], 'isActive': true }")
    List<Station> findBySearchQuery(String query);

    /**
     * Find stations with specific amenities
     */
    @Query("{ 'hasWifi': true, 'isActive': true }")
    List<Station> findStationsWithWifi();

    @Query("{ 'hasRestaurant': true, 'isActive': true }")
    List<Station> findStationsWithRestaurant();

    @Query("{ 'hasCarParking': true, 'isActive': true }")
    List<Station> findStationsWithParking();

    /**
     * Count stations by state
     */
    @Query(value = "{ 'state': ?0, 'isActive': true }", count = true)
    long countByState(String state);

    /**
     * Count total active stations
     */
    long countByIsActiveTrue();
}