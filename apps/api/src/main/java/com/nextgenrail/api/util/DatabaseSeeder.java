package com.nextgenrail.api.util;

import com.nextgenrail.api.model.*;
import com.nextgenrail.api.repository.BookingRepository;
import com.nextgenrail.api.repository.StationRepository;
import com.nextgenrail.api.repository.TrainRepository;
import com.nextgenrail.api.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.util.*;

/**
 * Database seeder utility
 * Seeds database with comprehensive IRCTC-like data on application startup
 */
@Component
@Profile({ "dev", "default" }) // Run in dev profile or default (no profile specified)
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private StationRepository stationRepository;

    @Autowired
    private TrainRepository trainRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public void run(String... args) throws Exception {
        logger.info("Starting comprehensive database seeding...");

        try {
            // Clear existing collections and indexes to avoid conflicts
            logger.info("Clearing existing data and indexes...");
            mongoTemplate.getCollection("trains").drop();
            mongoTemplate.getCollection("stations").drop();
            mongoTemplate.getCollection("users").drop();
            mongoTemplate.getCollection("bookings").drop();

            // Seed data in order
            seedStations();
            seedTrains();
            seedSampleUsers();
            seedSampleBookings();

            logger.info("Database seeding completed successfully!");
            logger.info("Final counts - Stations: {}, Trains: {}, Users: {}, Bookings: {}",
                    stationRepository.count(), trainRepository.count(),
                    userRepository.count(), bookingRepository.count());

        } catch (Exception e) {
            logger.error("Error during database seeding: {}", e.getMessage(), e);
        }
    }

    /**
     * Seed major railway stations across India
     */
    private void seedStations() {
        logger.info("Seeding railway stations...");

        List<Station> stations = Arrays.asList(
                // Delhi Region
                new Station("NDLS", "New Delhi", "New Delhi", "Delhi", "Northern Railway", 28.6448, 77.2083),
                new Station("DLI", "Old Delhi Junction", "Delhi", "Delhi", "Northern Railway", 28.6584, 77.2319),
                new Station("NZM", "Hazrat Nizamuddin", "New Delhi", "Delhi", "Northern Railway", 28.5933, 77.2507),
                new Station("DEC", "Delhi Cantt", "New Delhi", "Delhi", "Northern Railway", 28.5764, 77.1686),

                // Mumbai Region
                new Station("CSMT", "Mumbai CST", "Mumbai", "Maharashtra", "Central Railway", 18.9400, 72.8352),
                new Station("LTT", "Lokmanya Tilak Terminus", "Mumbai", "Maharashtra", "Central Railway", 19.0669,
                        72.9028),
                new Station("BDTS", "Bandra Terminus", "Mumbai", "Maharashtra", "Western Railway", 19.0634, 72.8403),
                new Station("BCT", "Mumbai Central", "Mumbai", "Maharashtra", "Western Railway", 18.9690, 72.8205),

                // Kolkata Region
                new Station("HWH", "Howrah Junction", "Howrah", "West Bengal", "Eastern Railway", 22.5804, 88.3453),
                new Station("KOAA", "Kolkata", "Kolkata", "West Bengal", "Eastern Railway", 22.5675, 88.3433),
                new Station("SDAH", "Sealdah", "Kolkata", "West Bengal", "Eastern Railway", 22.5937, 88.3685),

                // Chennai Region
                new Station("MAS", "Chennai Central", "Chennai", "Tamil Nadu", "Southern Railway", 13.0827, 80.2707),
                new Station("MSB", "Chennai Egmore", "Chennai", "Tamil Nadu", "Southern Railway", 13.0732, 80.2609),

                // Bangalore Region
                new Station("SBC", "Bengaluru City Junction", "Bengaluru", "Karnataka", "South Western Railway",
                        12.9716, 77.5946),
                new Station("YPR", "Yesvantpur Junction", "Bengaluru", "Karnataka", "South Western Railway", 13.0288,
                        77.5302),

                // Hyderabad Region
                new Station("SC", "Secunderabad Junction", "Hyderabad", "Telangana", "South Central Railway", 17.4399,
                        78.5011),
                new Station("HYB", "Hyderabad Deccan", "Hyderabad", "Telangana", "South Central Railway", 17.3850,
                        78.4867),

                // Other Major Stations
                new Station("PUNE", "Pune Junction", "Pune", "Maharashtra", "Central Railway", 18.5204, 73.8567),
                new Station("ADI", "Ahmedabad Junction", "Ahmedabad", "Gujarat", "Western Railway", 23.0225, 72.5714),
                new Station("JP", "Jaipur Junction", "Jaipur", "Rajasthan", "North Western Railway", 26.9124, 75.7873),
                new Station("LKO", "Lucknow Charbagh", "Lucknow", "Uttar Pradesh", "Northern Railway", 26.8467,
                        80.9462),
                new Station("PNBE", "Patna Junction", "Patna", "Bihar", "East Central Railway", 25.5941, 85.1376),
                new Station("BBS", "Bhubaneswar", "Bhubaneswar", "Odisha", "East Coast Railway", 20.2700, 85.8400),
                new Station("TPTY", "Tirupati", "Tirupati", "Andhra Pradesh", "South Central Railway", 13.6288,
                        79.4192),
                new Station("CBE", "Coimbatore Junction", "Coimbatore", "Tamil Nadu", "Southern Railway", 11.0168,
                        76.9558),
                new Station("TVC", "Thiruvananthapuram Central", "Thiruvananthapuram", "Kerala", "Southern Railway",
                        8.4875, 76.9525),
                new Station("ERS", "Ernakulam Junction", "Kochi", "Kerala", "Southern Railway", 9.9816, 76.2999),
                new Station("MDU", "Madurai Junction", "Madurai", "Tamil Nadu", "Southern Railway", 9.9252, 78.1198),
                new Station("VSKP", "Visakhapatnam Junction", "Visakhapatnam", "Andhra Pradesh", "East Coast Railway",
                        17.7231, 83.3219),
                new Station("RNC", "Ranchi Junction", "Ranchi", "Jharkhand", "South Eastern Railway", 23.3441, 85.3096),
                new Station("PURI", "Puri", "Puri", "Odisha", "East Coast Railway", 19.8135, 85.8312),

                // Additional Important Stations
                new Station("GWL", "Gwalior Junction", "Gwalior", "Madhya Pradesh", "North Central Railway", 26.2183,
                        78.1828),
                new Station("JBP", "Jabalpur Junction", "Jabalpur", "Madhya Pradesh", "West Central Railway", 23.1815,
                        79.9864),
                new Station("BPL", "Bhopal Junction", "Bhopal", "Madhya Pradesh", "West Central Railway", 23.2599,
                        77.4126),
                new Station("UJN", "Ujjain Junction", "Ujjain", "Madhya Pradesh", "West Central Railway", 23.1765,
                        75.7885),
                new Station("AGC", "Agra Cantt", "Agra", "Uttar Pradesh", "North Central Railway", 27.1767, 78.0081),
                new Station("CNB", "Kanpur Central", "Kanpur", "Uttar Pradesh", "North Central Railway", 26.4499,
                        80.3319),
                new Station("GKP", "Gorakhpur Junction", "Gorakhpur", "Uttar Pradesh", "North Eastern Railway", 26.7606,
                        83.3732),
                new Station("BSB", "Varanasi Junction", "Varanasi", "Uttar Pradesh", "North Eastern Railway", 25.3176,
                        82.9739),
                new Station("ALD", "Allahabad Junction", "Prayagraj", "Uttar Pradesh", "North Central Railway", 25.4358,
                        81.8463),
                new Station("DDN", "Dehradun", "Dehradun", "Uttarakhand", "Northern Railway", 30.3165, 78.0322),
                new Station("HW", "Haridwar Junction", "Haridwar", "Uttarakhand", "Northern Railway", 29.9457, 78.1642),
                new Station("CDG", "Chandigarh", "Chandigarh", "Punjab", "Northern Railway", 30.7333, 76.7794),
                new Station("ASR", "Amritsar Junction", "Amritsar", "Punjab", "Northern Railway", 31.6340, 74.8723),
                new Station("JUC", "Jalandhar City", "Jalandhar", "Punjab", "Northern Railway", 31.3260, 75.5762));

        for (Station station : stations) {
            if (!stationRepository.existsByCodeIgnoreCase(station.getCode())) {
                // Set principal station flags for major terminals
                if (Arrays.asList("NDLS", "CSMT", "HWH", "MAS", "SBC", "SC").contains(station.getCode())) {
                    station.setPrincipalStation(true);
                    station.setHasCarParking(true);
                    station.setHasWifi(true);
                    station.setHasRestaurant(true);
                    station.setHasWaitingRoom(true);
                }
                stationRepository.save(station);
            }
        }

        logger.info("Seeded {} railway stations", stations.size());
    }

    /**
     * Seed popular train routes
     */
    private void seedTrains() {
        logger.info("Seeding train routes...");

        List<Train> trains = createTrainData();

        for (Train train : trains) {
            if (!trainRepository.existsByTrainNumberIgnoreCase(train.getTrainNumber())) {
                trainRepository.save(train);
            }
        }

        logger.info("Seeded {} train routes", trains.size());
    }

    /**
     * Create comprehensive train data
     */
    private List<Train> createTrainData() {
        List<Train> trains = new ArrayList<>();

        // Rajdhani Express - Delhi to Mumbai
        Train rajdhani = new Train("12951", "Mumbai Rajdhani Express", TrainType.RAJDHANI);
        rajdhani.setOperationalDays(Arrays.asList("MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"));
        rajdhani.setRoutes(Arrays.asList(
                createRoute("NDLS", "New Delhi", null, LocalTime.of(16, 55), 0, 1, true, false),
                createRoute("GWL", "Gwalior", LocalTime.of(20, 38), LocalTime.of(20, 40), 319, 2),
                createRoute("JHS", "Jhansi", LocalTime.of(21, 53), LocalTime.of(21, 55), 415, 3),
                createRoute("BPL", "Bhopal", LocalTime.of(0, 15), LocalTime.of(0, 20), 707, 4),
                createRoute("NGP", "Nagpur", LocalTime.of(4, 15), LocalTime.of(4, 25), 1056, 5),
                createRoute("CSMT", "Mumbai CST", LocalTime.of(8, 35), null, 1384, 6, false, true)));
        rajdhani.setCoachConfiguration(Map.of("AC1A", 1, "AC2A", 4, "AC3A", 8));
        rajdhani.setBaseFarePerKm(Map.of("AC1A", 6.50, "AC2A", 4.20, "AC3A", 2.80));
        trains.add(rajdhani);

        // Shatabdi Express - Delhi to Chandigarh
        Train shatabdi = new Train("12006", "Chandigarh Shatabdi", TrainType.SHATABDI);
        shatabdi.setOperationalDays(Arrays.asList("MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"));
        shatabdi.setRoutes(Arrays.asList(
                createRoute("NDLS", "New Delhi", null, LocalTime.of(7, 20), 0, 1, true, false),
                createRoute("PNP", "Panipat", LocalTime.of(8, 18), LocalTime.of(8, 20), 90, 2),
                createRoute("KUK", "Kurukshetra", LocalTime.of(8, 58), LocalTime.of(9, 0), 151, 3),
                createRoute("UMB", "Ambala Cantt", LocalTime.of(9, 20), LocalTime.of(9, 25), 200, 4),
                createRoute("CDG", "Chandigarh", LocalTime.of(10, 45), null, 259, 5, false, true)));
        shatabdi.setCoachConfiguration(Map.of("CC", 1, "AC2A", 6));
        shatabdi.setBaseFarePerKm(Map.of("CC", 5.50, "AC2A", 4.20));
        trains.add(shatabdi);

        // Vande Bharat Express - Delhi to Varanasi
        Train vandeBharat = new Train("22436", "Vande Bharat Express", TrainType.VANDE_BHARAT);
        vandeBharat.setOperationalDays(Arrays.asList("TUE", "WED", "THU", "FRI", "SAT", "SUN"));
        vandeBharat.setRoutes(Arrays.asList(
                createRoute("NDLS", "New Delhi", null, LocalTime.of(6, 0), 0, 1, true, false),
                createRoute("CNB", "Kanpur Central", LocalTime.of(10, 20), LocalTime.of(10, 25), 441, 2),
                createRoute("ALD", "Prayagraj Junction", LocalTime.of(12, 6), LocalTime.of(12, 8), 635, 3),
                createRoute("BSB", "Varanasi Junction", LocalTime.of(14, 0), null, 764, 4, false, true)));
        vandeBharat.setCoachConfiguration(Map.of("CC", 14, "EC", 2));
        vandeBharat.setBaseFarePerKm(Map.of("CC", 5.00, "EC", 8.00));
        trains.add(vandeBharat);

        // Duronto Express - Mumbai to Howrah
        Train duronto = new Train("12261", "Howrah Duronto Express", TrainType.DURONTO);
        duronto.setOperationalDays(Arrays.asList("MON", "WED", "FRI"));
        duronto.setRoutes(Arrays.asList(
                createRoute("CSMT", "Mumbai CST", null, LocalTime.of(8, 30), 0, 1, true, false),
                createRoute("NGP", "Nagpur", LocalTime.of(15, 55), LocalTime.of(16, 5), 778, 2),
                createRoute("BPL", "Bhopal", LocalTime.of(19, 45), LocalTime.of(19, 50), 582, 3),
                createRoute("JBP", "Jabalpur", LocalTime.of(22, 15), LocalTime.of(22, 20), 378, 4),
                createRoute("ALD", "Prayagraj Junction", LocalTime.of(4, 18), LocalTime.of(4, 23), 1098, 5),
                createRoute("DDU", "Pandit Deen Dayal Upadhyaya Junction", LocalTime.of(5, 55), LocalTime.of(6, 0),
                        1186, 6),
                createRoute("HWH", "Howrah Junction", LocalTime.of(10, 30), null, 1968, 7, false, true)));
        duronto.setCoachConfiguration(Map.of("AC1A", 1, "AC2A", 5, "AC3A", 10));
        duronto.setBaseFarePerKm(Map.of("AC1A", 6.20, "AC2A", 4.00, "AC3A", 2.60));
        trains.add(duronto);

        // Express Train - Chennai to Bangalore
        Train chennaiExpress = new Train("12007", "Chennai Bangalore Express", TrainType.EXPRESS);
        chennaiExpress.setOperationalDays(Arrays.asList("MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"));
        chennaiExpress.setRoutes(Arrays.asList(
                createRoute("MAS", "Chennai Central", null, LocalTime.of(13, 30), 0, 1, true, false),
                createRoute("AJJ", "Arakkonam", LocalTime.of(14, 23), LocalTime.of(14, 25), 73, 2),
                createRoute("KPD", "Katpadi", LocalTime.of(15, 28), LocalTime.of(15, 30), 143, 3),
                createRoute("JTJ", "Jolarpettai", LocalTime.of(17, 38), LocalTime.of(17, 40), 284, 4),
                createRoute("DPJ", "Dharmapuri", LocalTime.of(18, 33), LocalTime.of(18, 35), 344, 5),
                createRoute("SBC", "Bengaluru City Junction", LocalTime.of(20, 15), null, 362, 6, false, true)));
        chennaiExpress.setCoachConfiguration(Map.of("AC3A", 2, "SL", 14, "2S", 2));
        chennaiExpress.setBaseFarePerKm(Map.of("AC3A", 2.80, "SL", 1.20, "2S", 0.50));
        trains.add(chennaiExpress);

        // Garib Rath - Delhi to Patna
        Train garibRath = new Train("12565", "Bihar Sampark Kranti Express", TrainType.GARIB_RATH);
        garibRath.setOperationalDays(Arrays.asList("MON", "TUE", "WED", "THU", "FRI", "SAT"));
        garibRath.setRoutes(Arrays.asList(
                createRoute("NDLS", "New Delhi", null, LocalTime.of(15, 50), 0, 1, true, false),
                createRoute("CNB", "Kanpur Central", LocalTime.of(21, 25), LocalTime.of(21, 35), 441, 2),
                createRoute("ALD", "Prayagraj Junction", LocalTime.of(23, 25), LocalTime.of(23, 30), 635, 3),
                createRoute("MGS", "Mughal Sarai", LocalTime.of(1, 7), LocalTime.of(1, 17), 678, 4),
                createRoute("BXR", "Buxar", LocalTime.of(2, 52), LocalTime.of(2, 54), 738, 5),
                createRoute("ARA", "Ara", LocalTime.of(3, 33), LocalTime.of(3, 35), 779, 6),
                createRoute("PNBE", "Patna Junction", LocalTime.of(4, 20), null, 814, 7, false, true)));
        garibRath.setCoachConfiguration(Map.of("AC3A", 18, "CC", 2));
        garibRath.setBaseFarePerKm(Map.of("AC3A", 2.20, "CC", 4.50));
        trains.add(garibRath);

        // Superfast Train - Mumbai to Pune
        Train deccanQueen = new Train("12123", "Deccan Queen Express", TrainType.SUPERFAST);
        deccanQueen.setOperationalDays(Arrays.asList("MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"));
        deccanQueen.setRoutes(Arrays.asList(
                createRoute("CSMT", "Mumbai CST", null, LocalTime.of(17, 10), 0, 1, true, false),
                createRoute("DR", "Dadar", LocalTime.of(17, 18), LocalTime.of(17, 20), 8, 2),
                createRoute("TNA", "Thane", LocalTime.of(17, 38), LocalTime.of(17, 40), 34, 3),
                createRoute("KYN", "Kalyan Junction", LocalTime.of(17, 58), LocalTime.of(18, 0), 54, 4),
                createRoute("LNL", "Lonavala", LocalTime.of(19, 8), LocalTime.of(19, 10), 106, 5),
                createRoute("PUNE", "Pune Junction", LocalTime.of(20, 25), null, 192, 6, false, true)));
        deccanQueen.setCoachConfiguration(Map.of("AC2A", 1, "FC", 2, "SL", 8, "2S", 4));
        deccanQueen.setBaseFarePerKm(Map.of("AC2A", 4.20, "FC", 3.50, "SL", 1.20, "2S", 0.50));
        trains.add(deccanQueen);

        return trains;
    }

    /**
     * Helper method to create train route
     */
    private TrainRoute createRoute(String stationCode, String stationName,
            LocalTime arrivalTime, LocalTime departureTime,
            int distance, int stopNumber) {
        return createRoute(stationCode, stationName, arrivalTime, departureTime,
                distance, stopNumber, false, false);
    }

    private TrainRoute createRoute(String stationCode, String stationName,
            LocalTime arrivalTime, LocalTime departureTime,
            int distance, int stopNumber,
            boolean isSource, boolean isDestination) {
        TrainRoute route = new TrainRoute(stationCode, stationName, arrivalTime,
                departureTime, distance, stopNumber);
        route.setSourceStation(isSource);
        route.setDestinationStation(isDestination);

        // Calculate halt duration for intermediate stations
        if (!isSource && !isDestination && arrivalTime != null && departureTime != null) {
            int haltMinutes = (int) java.time.Duration.between(arrivalTime, departureTime).toMinutes();
            route.setHaltDurationMinutes(haltMinutes);
        }

        return route;
    }

    /**
     * Seed sample users for testing
     */
    private void seedSampleUsers() {
        logger.info("Seeding sample users...");

        // Only seed if no users exist
        if (userRepository.count() > 0) {
            logger.info("Users already exist, skipping user seeding");
            return;
        }

        List<User> sampleUsers = Arrays.asList(
                createSampleUser("john.doe@example.com", "John", "Doe"),
                createSampleUser("jane.smith@example.com", "Jane", "Smith"),
                createSampleUser("rajesh.kumar@example.com", "Rajesh", "Kumar"),
                createSampleUser("priya.sharma@example.com", "Priya", "Sharma"),
                createSampleUser("test.user@nextgenrail.com", "Test", "User"));

        userRepository.saveAll(sampleUsers);
        logger.info("Seeded {} sample users", sampleUsers.size());
    }

    private User createSampleUser(String email, String firstName, String lastName) {
        User user = new User();
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhoneNumber("+91-98765" + String.format("%05d", new Random().nextInt(100000)));
        return user;
    }

    /**
     * Seed sample bookings for testing
     */
    private void seedSampleBookings() {
        logger.info("Seeding sample bookings...");

        // Only seed if less than 5 bookings exist
        if (bookingRepository.count() >= 5) {
            logger.info("Sufficient bookings already exist, skipping booking seeding");
            return;
        }

        // This would require more complex logic to create realistic bookings
        // For now, just log that booking seeding is available
        logger.info("Sample booking seeding completed (manual implementation required)");
    }
}