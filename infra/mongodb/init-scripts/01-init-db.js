// MongoDB Initialization Script for IRCTC-Plus
// This script creates the database and sets up initial indexes

// Connect to the database
db = db.getSiblingDB('nextgenrail_dev');

// Create collections
db.createCollection('stations');
db.createCollection('trains');
db.createCollection('users');
db.createCollection('bookings');

// Create indexes for better performance

// Stations collection indexes
db.stations.createIndex({ "code": 1 }, { unique: true, name: "idx_station_code_unique" });
db.stations.createIndex({ "name": "text", "city": "text" }, { name: "idx_station_search" });
db.stations.createIndex({ "coordinates": "2dsphere" }, { name: "idx_station_geo" });
db.stations.createIndex({ "isActive": 1 }, { name: "idx_station_active" });

// Trains collection indexes
db.trains.createIndex({ "trainNumber": 1 }, { unique: true, name: "idx_train_number_unique" });
db.trains.createIndex({ "trainName": "text" }, { name: "idx_train_search" });
db.trains.createIndex({ "trainType": 1 }, { name: "idx_train_type" });
db.trains.createIndex({ "operationalDays": 1 }, { name: "idx_train_days" });
db.trains.createIndex({ "routes.stationCode": 1 }, { name: "idx_train_routes" });

// Users collection indexes
db.users.createIndex({ "email": 1 }, { unique: true, name: "idx_user_email_unique" });
db.users.createIndex({ "phoneNumber": 1 }, { name: "idx_user_phone" });

// Bookings collection indexes
db.bookings.createIndex({ "pnrNumber": 1 }, { unique: true, name: "idx_booking_pnr_unique" });
db.bookings.createIndex({ "userEmail": 1 }, { name: "idx_booking_user" });
db.bookings.createIndex({ "trainNumber": 1 }, { name: "idx_booking_train" });
db.bookings.createIndex({ "journeyDate": 1 }, { name: "idx_booking_date" });
db.bookings.createIndex({ "bookingStatus": 1 }, { name: "idx_booking_status" });
db.bookings.createIndex({ "createdAt": 1 }, { name: "idx_booking_created" });

print('✅ Database initialization completed');
print('📊 Collections created: stations, trains, users, bookings');
print('🔍 Indexes created for optimal search performance');