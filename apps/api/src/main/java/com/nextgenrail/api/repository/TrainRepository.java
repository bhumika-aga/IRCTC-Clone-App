package com.nextgenrail.api.repository;

import com.nextgenrail.api.model.Train;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Train entity
 * Provides CRUD operations and custom queries for train schedules
 */
@Repository
public interface TrainRepository extends MongoRepository<Train, String> {

       /**
        * Find train by train number
        */
       Optional<Train> findByTrainNumberIgnoreCase(String trainNumber);

       /**
        * Check if train exists by train number
        */
       boolean existsByTrainNumberIgnoreCase(String trainNumber);

       /**
        * Find active trains only
        */
       List<Train> findByIsActiveTrue();

       /**
        * Find trains by train type
        */
       @Query("{ 'trainType': ?0, 'isActive': true }")
       List<Train> findByTrainType(String trainType);

       /**
        * Find trains operating on specific day
        */
       @Query("{ 'operationalDays': { '$in': [?0] }, 'isActive': true }")
       List<Train> findByOperationalDay(String day);

       /**
        * Find trains between two stations
        * Complex query to find trains that have both source and destination in their
        * route
        */
       @Query("{ " +
                     "'routes': { " +
                     "  '$elemMatch': { 'stationCode': ?0 } " +
                     "}, " +
                     "'routes': { " +
                     "  '$elemMatch': { 'stationCode': ?1 } " +
                     "}, " +
                     "'isActive': true " +
                     "}")
       List<Train> findTrainsBetweenStations(String sourceStationCode, String destinationStationCode);

       /**
        * Find trains that pass through a specific station
        */
       @Query("{ 'routes.stationCode': ?0, 'isActive': true }")
       List<Train> findTrainsByStation(String stationCode);

       /**
        * Find trains by name pattern
        */
       List<Train> findByTrainNameIgnoreCaseContaining(String trainName);

       /**
        * Find trains with specific coach configuration
        */
       @Query("{ 'coachConfiguration.?0': { '$exists': true, '$gt': 0 }, 'isActive': true }")
       List<Train> findTrainsByCoachType(String coachType);

       /**
        * Find premium trains (Rajdhani, Shatabdi, Vande Bharat)
        */
       @Query("{ 'trainType': { '$in': ['RAJDHANI', 'SHATABDI', 'VANDE_BHARAT'] }, 'isActive': true }")
       List<Train> findPremiumTrains();

       /**
        * Find express and superfast trains
        */
       @Query("{ 'trainType': { '$in': ['EXPRESS', 'SUPERFAST'] }, 'isActive': true }")
       List<Train> findExpressTrains();

       /**
        * Complex search for trains between stations on specific days
        */
       @Query("{ " +
                     "'routes': { " +
                     "  '$elemMatch': { 'stationCode': ?0 } " +
                     "}, " +
                     "'routes': { " +
                     "  '$elemMatch': { 'stationCode': ?1 } " +
                     "}, " +
                     "'operationalDays': { '$in': ?2 }, " +
                     "'isActive': true " +
                     "}")
       List<Train> findTrainsBetweenStationsOnDays(String sourceStationCode,
                     String destinationStationCode,
                     List<String> operationalDays);

       /**
        * Count trains by type
        */
       @Query(value = "{ 'trainType': ?0, 'isActive': true }", count = true)
       long countByTrainType(String trainType);

       /**
        * Count total active trains
        */
       long countByIsActiveTrue();

       /**
        * Find fastest trains between stations (by minimum travel time)
        * This would require additional logic in service layer to calculate actual
        * travel time
        */
       @Query("{ " +
                     "'routes': { " +
                     "  '$elemMatch': { 'stationCode': ?0 } " +
                     "}, " +
                     "'routes': { " +
                     "  '$elemMatch': { 'stationCode': ?1 } " +
                     "}, " +
                     "'trainType': { '$in': ['RAJDHANI', 'SHATABDI', 'VANDE_BHARAT', 'DURONTO'] }, " +
                     "'isActive': true " +
                     "}")
       List<Train> findFastestTrainsBetweenStations(String sourceStationCode, String destinationStationCode);
}