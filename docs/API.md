# NextGenRail API Documentation

## Overview

The NextGenRail API provides comprehensive railway booking functionality with JWT-based authentication, real-time availability, and secure payment processing.

**Base URL**: `http://localhost:8080/api`
**Version**: 1.0.0
**Authentication**: JWT Bearer tokens

## Authentication

### Request OTP

Request an OTP for email-based authentication.

```http
POST /auth/otp-login
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response**: `200 OK`

```txt
OTP sent successfully
```

### Verify OTP

Verify OTP and receive authentication tokens.

```http
POST /auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response**: `200 OK`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "user123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Refresh Token

Refresh an expired access token.

```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response**: `200 OK`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Profile

Get authenticated user profile.

```http
GET /auth/profile
Authorization: Bearer <access_token>
```

**Response**: `200 OK`

```json
{
  "id": "user123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+91-9876543210",
  "aadhaarNumber": "1234-5678-9012",
  "kycStatus": "VERIFIED",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Logout

Invalidate current session.

```http
POST /auth/logout
Authorization: Bearer <access_token>
```

**Response**: `200 OK`

```txt
Logged out successfully
```

## Stations

### Search Stations

Search for railway stations by name or code.

```http
GET /stations/search?query=delhi&limit=10
```

**Parameters**:

- `query` (required): Search term for station name or code
- `limit` (optional): Maximum results (default: 10)

**Response**: `200 OK`

```json
[
  {
    "id": "station123",
    "code": "NDLS",
    "name": "New Delhi",
    "city": "New Delhi",
    "state": "Delhi",
    "zone": "Northern Railway",
    "coordinates": {
      "latitude": 28.6448,
      "longitude": 77.2083
    }
  }
]
```

### Get All Stations

Retrieve all active railway stations.

```http
GET /stations?page=0&size=50&sort=name
```

**Parameters**:

- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 20)
- `sort` (optional): Sort field (default: name)

**Response**: `200 OK`

```json
{
  "content": [...stations],
  "totalElements": 150,
  "totalPages": 3,
  "size": 50,
  "number": 0
}
```

## Trains

### Search Trains

Search for trains between stations on a specific date.

```http
GET /trains/search?from=NDLS&to=CSMT&date=2024-02-15&page=0&size=10
```

**Parameters**:

- `from` (required): Source station code
- `to` (required): Destination station code  
- `date` (required): Travel date (YYYY-MM-DD)
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 10)

**Response**: `200 OK`

```json
{
  "content": [
    {
      "id": "train123",
      "trainNumber": "12951",
      "trainName": "Mumbai Rajdhani Express",
      "trainType": "RAJDHANI",
      "operationalDays": ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
      "routes": [
        {
          "stationCode": "NDLS",
          "stationName": "New Delhi",
          "arrivalTime": null,
          "departureTime": "16:55",
          "stopNumber": 1,
          "dayNumber": 1,
          "distance": 0
        },
        {
          "stationCode": "CSMT", 
          "stationName": "Mumbai CST",
          "arrivalTime": "08:35",
          "departureTime": null,
          "stopNumber": 7,
          "dayNumber": 2,
          "distance": 1384
        }
      ],
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
      "availability": {
        "AC1A": 12,
        "AC2A": 45,
        "AC3A": 120
      }
    }
  ],
  "totalElements": 8,
  "totalPages": 1
}
```

### Get Train Details

Get detailed information about a specific train.

```http
GET /trains/12951
```

**Response**: `200 OK`

```json
{
  "id": "train123",
  "trainNumber": "12951",
  "trainName": "Mumbai Rajdhani Express",
  "trainType": "RAJDHANI",
  "operationalDays": ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
  "routes": [...full route details],
  "coachConfiguration": {...coach config},
  "baseFarePerKm": {...fare structure},
  "facilities": ["WiFi", "Catering", "Bedroll"],
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## Bookings

### Create Booking

Book tickets for a train journey.

```http
POST /bookings
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "trainNumber": "12951",
  "fromStation": "NDLS",
  "toStation": "CSMT",
  "travelDate": "2024-02-15",
  "coachType": "AC3A",
  "passengers": [
    {
      "name": "John Doe",
      "age": 30,
      "gender": "MALE",
      "berth": "LOWER"
    },
    {
      "name": "Jane Doe", 
      "age": 28,
      "gender": "FEMALE",
      "berth": "UPPER"
    }
  ],
  "contactDetails": {
    "email": "user@example.com",
    "phoneNumber": "+91-9876543210"
  },
  "paymentMethod": "UPI"
}
```

**Response**: `201 Created`

```json
{
  "id": "booking123",
  "pnr": "PNR1234567890",
  "userId": "user123",
  "trainNumber": "12951",
  "trainName": "Mumbai Rajdhani Express",
  "fromStation": "NDLS",
  "toStation": "CSMT", 
  "travelDate": "2024-02-15",
  "bookingDate": "2024-01-15T10:30:00Z",
  "coachType": "AC3A",
  "coachNumber": "B2",
  "seatNumbers": ["23", "24"],
  "passengers": [...passenger details],
  "status": "CONFIRMED",
  "totalAmount": 5250.00,
  "baseAmount": 4500.00,
  "taxes": 750.00,
  "paymentId": "pay_abc123",
  "paymentStatus": "COMPLETED"
}
```

### Get Booking Details

Retrieve booking details by PNR.

```http
GET /bookings/PNR1234567890
Authorization: Bearer <access_token>
```

**Response**: `200 OK`

```json
{
  "id": "booking123",
  "pnr": "PNR1234567890",
  ...booking details
}
```

### Get User Bookings  

Get all bookings for authenticated user.

```http
GET /bookings/my-bookings?page=0&size=10&status=CONFIRMED
Authorization: Bearer <access_token>
```

**Parameters**:

- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 10)  
- `status` (optional): Filter by booking status

**Response**: `200 OK`

```json
{
  "content": [...bookings],
  "totalElements": 25,
  "totalPages": 3
}
```

### Cancel Booking

Cancel a confirmed booking.

```http
PUT /bookings/PNR1234567890/cancel
Authorization: Bearer <access_token>
```

**Response**: `200 OK`

```json
{
  "id": "booking123",
  "pnr": "PNR1234567890",
  "status": "CANCELLED",
  "cancellationDate": "2024-01-20T14:30:00Z",
  "refundAmount": 4725.00,
  "cancellationCharges": 525.00,
  ...other booking details
}
```

## Availability

### Check Seat Availability

Check real-time seat availability for a train.

```http
GET /availability?trainNumber=12951&date=2024-02-15&from=NDLS&to=CSMT
```

**Parameters**:

- `trainNumber` (required): Train number
- `date` (required): Travel date (YYYY-MM-DD)
- `from` (required): Source station code
- `to` (required): Destination station code

**Response**: `200 OK`

```json
{
  "trainNumber": "12951",
  "trainName": "Mumbai Rajdhani Express",
  "date": "2024-02-15",
  "fromStation": "NDLS",
  "toStation": "CSMT",
  "availability": {
    "AC1A": {
      "available": 8,
      "total": 20,
      "waitingList": 0,
      "status": "AVAILABLE"
    },
    "AC2A": {
      "available": 23,
      "total": 64,
      "waitingList": 2,
      "status": "AVAILABLE"  
    },
    "AC3A": {
      "available": 145,
      "total": 240,
      "waitingList": 15,
      "status": "AVAILABLE"
    }
  },
  "lastUpdated": "2024-01-15T10:45:00Z"
}
```

## User Management

### Update Profile

Update user profile information.

```http
PUT /users/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith", 
  "phoneNumber": "+91-9876543210",
  "dateOfBirth": "1990-05-15",
  "gender": "MALE",
  "address": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001"
  }
}
```

**Response**: `200 OK`

```json
{
  "id": "user123",
  "email": "user@example.com", 
  "firstName": "John",
  "lastName": "Smith",
  ...updated profile
}
```

### Complete KYC

Complete Aadhaar-based KYC verification.

```http
POST /users/kyc
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "aadhaarNumber": "1234-5678-9012",
  "otp": "123456"
}
```

**Response**: `200 OK`

```json
{
  "kycStatus": "VERIFIED",
  "aadhaarNumber": "****-****-9012",
  "verifiedAt": "2024-01-15T11:00:00Z"
}
```

## Error Responses

### Standard Error Format

All API errors follow this format:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request", 
  "message": "Validation failed",
  "path": "/api/bookings",
  "errors": [
    {
      "field": "travelDate",
      "message": "Travel date cannot be in the past"
    }
  ]
}
```

### HTTP Status Codes

- `200 OK`: Success
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Access denied
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server error

### Common Error Scenarios

#### Authentication Errors

```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "JWT token has expired"
}
```

#### Validation Errors

```json
{
  "status": 422,
  "error": "Unprocessable Entity", 
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

#### Business Logic Errors

```json
{
  "status": 409,
  "error": "Conflict",
  "message": "Insufficient seats available"
}
```

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute per IP
- **Search endpoints**: 100 requests per minute per user
- **Booking endpoints**: 10 requests per minute per user
- **General endpoints**: 500 requests per hour per user

Rate limit headers:

```txt
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248600
```

## WebSocket Events

### Real-time Updates

Connect to `/ws/availability` for real-time seat availability updates.

**Events**:

- `availability-update`: Seat availability changed
- `booking-confirmed`: New booking confirmed
- `train-delayed`: Train delay notification

**Example**:

```javascript
const socket = io('/ws/availability');
socket.on('availability-update', (data) => {
  console.log('Availability updated:', data);
});
```

## SDK Integration

### JavaScript/TypeScript

```bash
npm install @nextgenrail/api-client
```

```typescript
import { NextGenRailAPI } from '@nextgenrail/api-client';

const api = new NextGenRailAPI({
  baseURL: 'http://localhost:8080/api',
  apiKey: 'your-api-key'
});

const trains = await api.trains.search({
  from: 'NDLS',
  to: 'CSMT', 
  date: '2024-02-15'
});
```

## Postman Collection

Import the API collection: [NextGenRail.postman_collection.json](./postman/NextGenRail.postman_collection.json)

## Support

For API support:

- Email: <api-support@nextgenrail.com>
- Documentation: <https://docs.nextgenrail.com>
- Status Page: <https://status.nextgenrail.com>
