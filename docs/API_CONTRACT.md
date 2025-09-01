# 📋 API Contract Documentation

This document provides the complete API reference for IRCTC-Plus backend services.

## Base URL

- **Development**: `http://localhost:8080`
- **Production**: `https://irctc-plus-api.onrender.com`

## Authentication

All endpoints use anonymous JWT session tokens. No user registration required.

### Headers

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

## Endpoints

### 🔐 Authentication

#### Generate Anonymous Session

```http
POST /auth/session
```

Response

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "sessionId": "uuid-v4-session-id",
  "expiresIn": 86400
}
```

#### Refresh Token

```http
POST /auth/refresh
```

Body

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 🚉 Stations

#### Search Stations

```http
GET /stations?q={query}&limit={limit}
```

Parameters

- `q` (required): Search query (station name or code)
- `limit` (optional): Max results (default: 10)

Example

```http
GET /stations?q=delhi&limit=5
```

Response

```json
[
  {
    "id": "64f12345678901234567890a",
    "code": "NDLS",
    "name": "New Delhi",
    "city": "New Delhi",
    "state": "Delhi",
    "zone": "Northern Railway",
    "coordinates": {
      "latitude": 28.6448,
      "longitude": 77.2083
    },
    "amenities": ["WiFi", "Waiting Room", "Food Court"]
  }
]
```

### 🔍 Train Search

#### Search Trains

```http
POST /search
```

Body

```json
{
  "fromStation": "NDLS",
  "toStation": "CSMT",
  "travelDate": "2024-02-15",
  "quota": "GENERAL",
  "classCode": "AC3A"
}
```

Response

```json
{
  "content": [
    {
      "train": {
        "id": "64f12345678901234567890b",
        "trainNumber": "12951",
        "trainName": "Mumbai Rajdhani Express",
        "trainType": "RAJDHANI",
        "routes": [
          {
            "stationCode": "NDLS",
            "stationName": "New Delhi",
            "departureTime": "16:55",
            "stopNumber": 1,
            "dayNumber": 1,
            "distance": 0,
            "isSource": true,
            "isDestination": false
          },
          {
            "stationCode": "CSMT",
            "stationName": "Mumbai CST",
            "arrivalTime": "08:35",
            "stopNumber": 7,
            "dayNumber": 2,
            "distance": 1384,
            "isSource": false,
            "isDestination": true
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
        }
      },
      "availability": {
        "AC1A": {
          "available": 12,
          "total": 20,
          "waitingList": 0,
          "status": "AVAILABLE"
        },
        "AC2A": {
          "available": 45,
          "total": 64,
          "waitingList": 2,
          "status": "AVAILABLE"
        },
        "AC3A": {
          "available": 120,
          "total": 240,
          "waitingList": 15,
          "status": "AVAILABLE"
        }
      },
      "fare": {
        "AC1A": 9006,
        "AC2A": 5817,
        "AC3A": 3875
      },
      "duration": "15h 40m",
      "distance": 1384
    }
  ],
  "totalElements": 8,
  "totalPages": 1,
  "size": 10,
  "number": 0
}
```

### 🎫 Availability

#### Check Train Availability

```http
GET /trains/{trainNumber}/availability?date={date}&classCode={classCode}&quota={quota}
```

Parameters

- `trainNumber` (required): Train number (e.g., "12951")
- `date` (required): Travel date (YYYY-MM-DD)
- `classCode` (optional): Class code filter
- `quota` (optional): Quota type

Example

```http
GET /trains/12951/availability?date=2024-02-15&classCode=AC3A&quota=GENERAL
```

Response

```json
{
  "trainNumber": "12951",
  "trainName": "Mumbai Rajdhani Express",
  "date": "2024-02-15",
  "availability": {
    "AC1A": {
      "available": 12,
      "total": 20,
      "waitingList": 0,
      "status": "AVAILABLE"
    },
    "AC2A": {
      "available": 45,
      "total": 64,
      "waitingList": 2,
      "status": "AVAILABLE"
    },
    "AC3A": {
      "available": 120,
      "total": 240,
      "waitingList": 15,
      "status": "AVAILABLE"
    }
  },
  "lastUpdated": "2024-01-15T10:45:00Z"
}
```

### 🚂 Coach Layout

#### Get Coach Layout

```http
GET /trains/{trainNumber}/coach-layout?classCode={classCode}
```

Parameters

- `trainNumber` (required): Train number
- `classCode` (required): Class code (AC1A, AC2A, AC3A, SL, CC, 2S)

Response

```json
{
  "coachType": "AC3A",
  "layout": [
    [
      {
        "seatNumber": 1,
        "berthType": "LOWER",
        "isAvailable": true,
        "isReserved": false
      },
      {
        "seatNumber": 2,
        "berthType": "MIDDLE",
        "isAvailable": false,
        "isReserved": true,
        "gender": "FEMALE",
        "age": 28
      }
    ]
  ],
  "amenities": ["AC", "Charging Point", "Reading Light"]
}
```

### 📋 Bookings

#### Create Booking

```http
POST /bookings
Authorization: Bearer <access_token>
```

Body

```json
{
  "trainNumber": "12951",
  "fromStation": "NDLS",
  "toStation": "CSMT",
  "travelDate": "2024-02-15",
  "classCode": "AC3A",
  "quota": "GENERAL",
  "passengers": [
    {
      "name": "John Doe",
      "age": 30,
      "gender": "MALE",
      "berthPreference": "LOWER"
    },
    {
      "name": "Jane Doe",
      "age": 28,
      "gender": "FEMALE",
      "berthPreference": "UPPER"
    }
  ],
  "contactDetails": {
    "email": "john.doe@example.com",
    "phoneNumber": "+91-9876543210"
  }
}
```

Response

```json
{
  "id": "64f12345678901234567890c",
  "pnrNumber": "PNR1234567890",
  "trainNumber": "12951",
  "trainName": "Mumbai Rajdhani Express",
  "fromStation": "NDLS",
  "toStation": "CSMT",
  "travelDate": "2024-02-15",
  "bookingDate": "2024-01-15T10:30:00Z",
  "classCode": "AC3A",
  "quota": "GENERAL",
  "passengers": [
    {
      "name": "John Doe",
      "age": 30,
      "gender": "MALE",
      "berthPreference": "LOWER"
    },
    {
      "name": "Jane Doe",
      "age": 28,
      "gender": "FEMALE",
      "berthPreference": "UPPER"
    }
  ],
  "seatAllocations": [
    {
      "passengerName": "John Doe",
      "coachNumber": "B2",
      "seatNumber": 23,
      "berthType": "LOWER",
      "status": "CONFIRMED"
    },
    {
      "passengerName": "Jane Doe",
      "coachNumber": "B2",
      "seatNumber": 24,
      "berthType": "UPPER",
      "status": "CONFIRMED"
    }
  ],
  "status": "CONFIRMED",
  "totalFare": 7750.00,
  "convenienceFee": 40.00,
  "totalAmount": 7790.00,
  "isPaid": true,
  "contactDetails": {
    "email": "john.doe@example.com",
    "phoneNumber": "+91-9876543210"
  }
}
```

#### Get Booking Details

```http
GET /bookings/{pnr}
Authorization: Bearer <access_token>
```

**Response**: Same as booking creation response

#### Cancel Booking

```http
POST /bookings/{pnr}/cancel
Authorization: Bearer <access_token>
```

Body

```json
{
  "reason": "Change of plans"
}
```

Response

```json
{
  "id": "64f12345678901234567890c",
  "pnrNumber": "PNR1234567890",
  "status": "CANCELLED",
  "cancellationDetails": {
    "cancelledAt": "2024-01-20T14:30:00Z",
    "cancellationCharges": 780.00,
    "refundAmount": 7010.00,
    "reason": "Change of plans"
  }
}
```

### 🎫 PNR Status

#### Get PNR Status

```http
GET /pnr/{pnr}
```

Response

```json
{
  "pnr": "PNR1234567890",
  "currentStatus": "CONFIRMED",
  "trainNumber": "12951",
  "trainName": "Mumbai Rajdhani Express",
  "travelDate": "2024-02-15",
  "from": "NDLS",
  "to": "CSMT",
  "passengers": [
    {
      "name": "John Doe",
      "currentStatus": "CONFIRMED",
      "seatNumber": "23",
      "coachNumber": "B2"
    },
    {
      "name": "Jane Doe",
      "currentStatus": "CONFIRMED",
      "seatNumber": "24",
      "coachNumber": "B2"
    }
  ],
  "chartPrepared": false,
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

### 💰 Refund Policies

#### Get Refund Policies

```http
GET /refund-policies?classCode={classCode}
```

Response

```json
[
  {
    "classCode": "AC3A",
    "timeSlots": [
      {
        "hoursBeforeDeparture": 48,
        "cancellationChargePercent": 5,
        "minimumCharge": 240
      },
      {
        "hoursBeforeDeparture": 12,
        "cancellationChargePercent": 25,
        "minimumCharge": 240
      },
      {
        "hoursBeforeDeparture": 4,
        "cancellationChargePercent": 50,
        "minimumCharge": 240
      }
    ],
    "tatkalRefundRules": {
      "isRefundable": false,
      "conditions": [
        "No refund for Tatkal tickets except in case of train cancellation"
      ]
    }
  }
]
```

### 🔮 Waitlist Prediction

#### Get Waitlist Prediction

```http
GET /waitlist/predict?trainNumber={trainNumber}&date={date}&classCode={classCode}&waitlistNumber={number}
```

Parameters

- `trainNumber` (required): Train number
- `date` (required): Travel date
- `classCode` (required): Class code
- `waitlistNumber` (required): Current waitlist position

Response

```json
{
  "probability": 0.75,
  "rationale": "Based on historical data, 75% of waitlist positions up to 20 get confirmed for this train-date combination",
  "expectedConfirmationTime": "2024-02-10T18:00:00Z",
  "suggestedAlternatives": [
    "12953 - Mumbai Rajdhani (Alternative day)",
    "12615 - Grand Trunk Express"
  ]
}
```

## WebSocket Events

### Connection

```javascript
const socket = io('/ws/availability');
```

### Events

#### Availability Update

```javascript
socket.on('AVAILABILITY_UPDATE', (data) => {
  // Handle availability change
  console.log(data);
});
```

Event Data

```json
{
  "type": "AVAILABILITY_UPDATE",
  "data": {
    "trainNumber": "12951",
    "date": "2024-02-15",
    "classCode": "AC3A",
    "availability": {
      "available": 118,
      "total": 240,
      "waitingList": 17,
      "status": "AVAILABLE"
    }
  },
  "timestamp": "2024-01-15T10:45:00Z"
}
```

#### Booking Confirmed

```javascript
socket.on('BOOKING_CONFIRMED', (data) => {
  // Handle booking confirmation
  console.log(data);
});
```

#### PNR Update

```javascript
socket.on('PNR_UPDATE', (data) => {
  // Handle PNR status change
  console.log(data);
});
```

## Error Handling

### Standard Error Response

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/bookings",
  "errors": [
    {
      "field": "travelDate",
      "message": "Travel date cannot be in the past"
    }
  ]
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Rate Limited |
| 500 | Server Error |

## Rate Limits

| Endpoint Category | Limit |
|------------------|--------|
| Authentication | 10/minute |
| Search | 60/minute |
| Booking | 5/minute |
| PNR Status | 30/minute |
| General | 120/minute |

## Data Validation

### Date Format

- ISO 8601: `YYYY-MM-DD`
- DateTime: `YYYY-MM-DDTHH:mm:ssZ`

### Phone Number Format

- Indian: `+91-XXXXXXXXXX`
- International: `+XX-XXXXXXXXXX`

### Email Format

- Standard RFC 5322 validation

### Station Codes

- 3-4 character uppercase codes (e.g., "NDLS", "CSMT")

### Train Numbers

- 4-5 digit numeric codes (e.g., "12951", "22436")

## Testing

### Swagger UI

Access interactive API documentation at `/swagger-ui.html`

### Test Data

The API is pre-seeded with synthetic data for testing:

- 45+ railway stations
- 7 train routes
- Various class configurations
- Sample booking scenarios

### Postman Collection

Import the collection from `/docs/postman/IRCTC-Plus.postman_collection.json`
