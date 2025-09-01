# 🗄️ Data Model Documentation

This document describes the MongoDB collections, schemas, and indexes used in IRCTC-Plus.

## Database Overview

- **Database Name**: `irctcplus`
- **MongoDB Version**: 4.4+
- **Connection**: MongoDB Atlas (Free Tier M0)

## Collections

### 📍 stations

Railway station information with search capabilities.

Schema

```javascript
{
  _id: ObjectId,
  code: String,           // Unique station code (e.g., "NDLS")
  name: String,           // Station name (e.g., "New Delhi")
  city: String,           // City name
  state: String,          // State name
  zone: String,           // Railway zone (optional)
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  amenities: [String],    // Available facilities
  isActive: Boolean,      // Station operational status
  createdAt: Date,
  updatedAt: Date
}
```

Indexes

```javascript
// Text search index for name and city
db.stations.createIndex({ 
  name: "text", 
  city: "text" 
}, { 
  weights: { name: 2, city: 1 } 
})

// Unique index on station code
db.stations.createIndex({ code: 1 }, { unique: true })

// Geospatial index for location-based queries
db.stations.createIndex({ "coordinates": "2dsphere" })

// Compound index for filtered searches
db.stations.createIndex({ state: 1, isActive: 1 })
```

Sample Document

```json
{
  "_id": "64f12345678901234567890a",
  "code": "NDLS",
  "name": "New Delhi",
  "city": "New Delhi",
  "state": "Delhi",
  "zone": "Northern Railway",
  "coordinates": {
    "latitude": 28.6448,
    "longitude": 77.2083
  },
  "amenities": ["WiFi", "Waiting Room", "Food Court", "ATM"],
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### 🚂 trains

Train information including routes and operational details.

Schema

```javascript
{
  _id: ObjectId,
  trainNumber: String,    // Unique train number
  trainName: String,      // Train name
  trainType: String,      // RAJDHANI, SHATABDI, etc.
  routes: [{
    stationCode: String,
    stationName: String,
    arrivalTime: String,   // HH:mm format
    departureTime: String, // HH:mm format
    stopNumber: Number,
    dayNumber: Number,     // Day of journey
    distance: Number,      // Distance from origin
    isSource: Boolean,
    isDestination: Boolean,
    platform: String      // Platform number (optional)
  }],
  operationalDays: [String], // ["MON", "TUE", ...]
  coachConfiguration: {
    "AC1A": Number,        // Number of coaches per class
    "AC2A": Number,
    "AC3A": Number,
    "SL": Number,
    "CC": Number,
    "2S": Number
  },
  baseFarePerKm: {
    "AC1A": Number,        // Base fare per km per class
    "AC2A": Number,
    "AC3A": Number,
    "SL": Number,
    "CC": Number,
    "2S": Number
  },
  facilities: [String],   // Available facilities
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

Indexes

```javascript
// Unique index on train number
db.trains.createIndex({ trainNumber: 1 }, { unique: true })

// Compound index for route queries
db.trains.createIndex({ 
  "routes.stationCode": 1, 
  operationalDays: 1,
  isActive: 1 
})

// Index for train type filtering
db.trains.createIndex({ trainType: 1, isActive: 1 })

// Text search index for train names
db.trains.createIndex({ trainName: "text" })
```

Sample Document

```json
{
  "_id": "64f12345678901234567890b",
  "trainNumber": "12951",
  "trainName": "Mumbai Rajdhani Express",
  "trainType": "RAJDHANI",
  "routes": [
    {
      "stationCode": "NDLS",
      "stationName": "New Delhi",
      "arrivalTime": null,
      "departureTime": "16:55",
      "stopNumber": 1,
      "dayNumber": 1,
      "distance": 0,
      "isSource": true,
      "isDestination": false,
      "platform": "16"
    },
    {
      "stationCode": "CSMT",
      "stationName": "Mumbai CST",
      "arrivalTime": "08:35",
      "departureTime": null,
      "stopNumber": 7,
      "dayNumber": 2,
      "distance": 1384,
      "isSource": false,
      "isDestination": true,
      "platform": "18"
    }
  ],
  "operationalDays": ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
  "coachConfiguration": {
    "AC1A": 1,
    "AC2A": 4,
    "AC3A": 8
  },
  "baseFarePerKm": {
    "AC1A": 6.50,
    "AC2A": 4.20,
    "AC3A": 2.80
  },
  "facilities": ["WiFi", "Catering", "Bedroll"],
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### 🎫 bookings

Ticket booking records with passenger and payment information.

Schema

```javascript
{
  _id: ObjectId,
  pnrNumber: String,      // Unique PNR number
  sessionId: String,      // Anonymous session identifier
  trainNumber: String,
  trainName: String,
  fromStation: String,    // Source station code
  toStation: String,      // Destination station code
  travelDate: Date,
  bookingDate: Date,
  classCode: String,      // Travel class
  quota: String,          // Booking quota
  passengers: [{
    name: String,
    age: Number,
    gender: String,        // MALE, FEMALE, TRANSGENDER
    berthPreference: String,
    isSeniorCitizen: Boolean,
    isChild: Boolean,
    isInfant: Boolean
  }],
  seatAllocations: [{
    passengerName: String,
    coachNumber: String,
    seatNumber: Number,
    berthType: String,
    status: String         // CONFIRMED, RAC, WAITLISTED
  }],
  status: String,          // Current booking status
  totalFare: Number,
  convenienceFee: Number,
  totalAmount: Number,
  isPaid: Boolean,
  contactDetails: {
    email: String,
    phoneNumber: String
  },
  cancellationDetails: {
    cancelledAt: Date,
    cancellationCharges: Number,
    refundAmount: Number,
    reason: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

Indexes

```javascript
// Unique index on PNR number
db.bookings.createIndex({ pnrNumber: 1 }, { unique: true })

// Index for session-based queries
db.bookings.createIndex({ sessionId: 1, createdAt: -1 })

// Compound index for train and date queries
db.bookings.createIndex({ 
  trainNumber: 1, 
  travelDate: 1,
  status: 1 
})

// Index for status-based filtering
db.bookings.createIndex({ status: 1, updatedAt: -1 })

// TTL index for cleanup of old cancelled bookings (90 days)
db.bookings.createIndex(
  { updatedAt: 1 }, 
  { 
    expireAfterSeconds: 7776000,
    partialFilterExpression: { status: "CANCELLED" }
  }
)
```

### 📊 schedules

Train schedule and availability information.

Schema

```javascript
{
  _id: ObjectId,
  trainNumber: String,
  date: Date,             // Travel date
  routeAvailability: [{
    fromStationCode: String,
    toStationCode: String,
    classAvailability: {
      "AC1A": {
        available: Number,
        total: Number,
        waitingList: Number,
        status: String    // AVAILABLE, RAC, WAITING, FULL
      },
      "AC2A": { /* ... */ },
      "AC3A": { /* ... */ }
    }
  }],
  chartPrepared: Boolean,
  lastUpdated: Date,
  createdAt: Date
}
```

Indexes

```javascript
// Compound index for schedule queries
db.schedules.createIndex({ 
  trainNumber: 1, 
  date: 1 
}, { unique: true })

// Index for chart status queries
db.schedules.createIndex({ date: 1, chartPrepared: 1 })

// TTL index for old schedules (30 days)
db.schedules.createIndex(
  { date: 1 }, 
  { expireAfterSeconds: 2592000 }
)
```

### 🏗️ coachLayouts

Coach seating layout configurations.

Schema

```javascript
{
  _id: ObjectId,
  trainNumber: String,
  coachType: String,      // AC1A, AC2A, AC3A, SL, CC, 2S
  layout: [[{
    seatNumber: Number,
    berthType: String,    // LOWER, MIDDLE, UPPER, SIDE_LOWER, SIDE_UPPER
    position: {
      row: Number,
      column: Number
    }
  }]],
  totalSeats: Number,
  amenities: [String],
  createdAt: Date
}
```

Indexes

```javascript
// Compound index for layout queries
db.coachLayouts.createIndex({ 
  trainNumber: 1, 
  coachType: 1 
}, { unique: true })
```

### 📋 pnrStatuses

Real-time PNR status tracking.

Schema

```javascript
{
  _id: ObjectId,
  pnr: String,
  currentStatus: String,
  trainNumber: String,
  trainName: String,
  travelDate: Date,
  fromStation: String,
  toStation: String,
  passengers: [{
    name: String,
    currentStatus: String,
    seatNumber: String,
    coachNumber: String,
    previousStatus: [String] // Status history
  }],
  chartPrepared: Boolean,
  statusHistory: [{
    status: String,
    timestamp: Date,
    reason: String
  }],
  lastUpdated: Date
}
```

Indexes

```javascript
// Unique index on PNR
db.pnrStatuses.createIndex({ pnr: 1 }, { unique: true })

// Index for train and date queries
db.pnrStatuses.createIndex({ 
  trainNumber: 1, 
  travelDate: 1 
})

// TTL index for old PNR records (180 days)
db.pnrStatuses.createIndex(
  { lastUpdated: 1 }, 
  { expireAfterSeconds: 15552000 }
)
```

### 💰 refundPolicies

Cancellation and refund rule definitions.

Schema

```javascript
{
  _id: ObjectId,
  classCode: String,
  trainType: String,      // Optional: specific train type rules
  timeSlots: [{
    hoursBeforeDeparture: Number,
    cancellationChargePercent: Number,
    minimumCharge: Number
  }],
  tatkalRefundRules: {
    isRefundable: Boolean,
    conditions: [String]
  },
  specialConditions: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

Indexes

```javascript
// Index for class-based lookups
db.refundPolicies.createIndex({ classCode: 1, isActive: 1 })

// Compound index for train type specific rules
db.refundPolicies.createIndex({ 
  classCode: 1, 
  trainType: 1, 
  isActive: 1 
})
```

### 📝 auditLogs

System activity and audit trail.

Schema

```javascript
{
  _id: ObjectId,
  sessionId: String,
  action: String,         // SEARCH, BOOK, CANCEL, etc.
  entityType: String,     // booking, search, etc.
  entityId: String,       // PNR, search ID, etc.
  details: {
    // Action-specific data
    from: String,
    to: String,
    date: Date,
    // ... other relevant fields
  },
  userAgent: String,
  ipAddress: String,
  timestamp: Date
}
```

Indexes

```javascript
// Index for session-based queries
db.auditLogs.createIndex({ sessionId: 1, timestamp: -1 })

// Index for action-based analysis
db.auditLogs.createIndex({ action: 1, timestamp: -1 })

// TTL index for log cleanup (365 days)
db.auditLogs.createIndex(
  { timestamp: 1 }, 
  { expireAfterSeconds: 31536000 }
)
```

## Data Seeding

### Sample Data Overview

The application is pre-seeded with realistic synthetic data:

Stations (45 entries)

- Major Indian railway stations
- Geographical distribution across zones
- Complete amenity information

Trains (7 entries)

- Popular train routes (Rajdhani, Shatabdi, Vande Bharat)
- Realistic timings and distances
- Multiple class configurations

Example Seeded Routes

1. **12951** - Mumbai Rajdhani Express (NDLS → CSMT)
2. **12006** - New Delhi Shatabdi (NDLS → KLK)
3. **22436** - Vande Bharat Express (NDLS → UMB)
4. **12261** - Duronto Express (NDLS → CSMT)
5. **12007** - Chennai Shatabdi (NDLS → MAS)
6. **12565** - Bihar Sampark Kranti (NDLS → PNBE)
7. **12123** - Deccan Queen (CSMT → PUNE)

### Seeding Commands

```javascript
// Stations seeding
db.stations.insertMany([
  {
    code: "NDLS",
    name: "New Delhi",
    city: "New Delhi",
    state: "Delhi",
    zone: "Northern Railway",
    coordinates: { latitude: 28.6448, longitude: 77.2083 },
    amenities: ["WiFi", "Waiting Room", "Food Court", "ATM"],
    isActive: true
  },
  // ... more stations
]);

// Trains seeding
db.trains.insertMany([
  {
    trainNumber: "12951",
    trainName: "Mumbai Rajdhani Express",
    trainType: "RAJDHANI",
    routes: [
      {
        stationCode: "NDLS",
        stationName: "New Delhi",
        departureTime: "16:55",
        stopNumber: 1,
        dayNumber: 1,
        distance: 0,
        isSource: true,
        isDestination: false
      }
      // ... more route stops
    ],
    operationalDays: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    coachConfiguration: { "AC1A": 1, "AC2A": 4, "AC3A": 8 },
    baseFarePerKm: { "AC1A": 6.50, "AC2A": 4.20, "AC3A": 2.80 },
    isActive: true
  }
  // ... more trains
]);
```

## Performance Considerations

### Index Strategy

- **Composite indexes** for multi-field queries
- **Text indexes** for search functionality
- **Geospatial indexes** for location queries
- **TTL indexes** for automatic cleanup

### Caching Strategy

- Station data cached in application memory
- Train routes cached with 1-hour TTL
- Availability data cached with 5-minute TTL

### Partitioning

- Bookings can be partitioned by travel date
- Audit logs partitioned by timestamp
- Consider sharding for high-volume production

### Connection Pooling

```yaml
# MongoDB connection settings
mongodb:
  uri: ${MONGODB_URI}
  database: irctcplus
  pool:
    min: 5
    max: 20
    maxWaitTime: 2000
    serverSelectionTimeout: 5000
```

## Backup and Recovery

### Automated Backups

- MongoDB Atlas provides automatic backups
- Point-in-time recovery available
- Cross-region backup replication

### Data Retention Policies

- **Bookings**: Retain cancelled bookings for 90 days
- **PNR Status**: Retain for 180 days post-travel
- **Audit Logs**: Retain for 365 days
- **Schedules**: Retain for 30 days

### Data Privacy

- No personally identifiable information stored beyond contact details
- Session-based anonymous tracking
- GDPR-compliant data handling

## Migration Scripts

### Schema Updates

```javascript
// Example: Adding new field to existing collection
db.stations.updateMany(
  {},
  { $set: { timezone: "Asia/Kolkata" } }
);

// Adding new index
db.bookings.createIndex({ "contactDetails.email": 1 });
```

### Data Migration

```javascript
// Example: Migrating old booking format
db.bookings.find({ version: { $exists: false } }).forEach(function(doc) {
  db.bookings.updateOne(
    { _id: doc._id },
    { 
      $set: { 
        version: "2.0",
        sessionId: doc.userId || "anonymous" 
      },
      $unset: { userId: 1 }
    }
  );
});
```

This data model provides a robust foundation for the IRCTC-Plus application with optimized performance, scalability, and maintainability.
