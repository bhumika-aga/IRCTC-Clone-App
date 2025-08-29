# 🚆 NextGenRail - Production-Grade IRCTC Clone

A comprehensive railway booking system built with modern technologies, featuring real-time seat availability, secure JWT authentication, and a polished Material UI interface.

## 🎯 Project Status

✅ **FULLY OPERATIONAL** - All components working and tested

| Component | Status | Description |
|-----------|--------|-------------|
| 🏗️ **Backend API** | ✅ **Working** | Spring Boot application compiles, runs, and connects to MongoDB |
| 🎨 **Frontend** | ✅ **Working** | React application builds and serves successfully |
| 🗄️ **Database** | ✅ **Seeded** | MongoDB Atlas connected with initial data (8 stations, 1 train) |
| 🔐 **Authentication** | ✅ **Implemented** | JWT-based auth with OTP login flow |
| 📚 **API Docs** | ✅ **Available** | Comprehensive API documentation generated |
| 🧪 **Tests** | ✅ **Created** | Unit tests for services and controllers |
| 🐳 **Docker** | ✅ **Ready** | Production-ready containerization |

**MongoDB Connection**: `mongodb+srv://bhumika-aga:test@movie.elou1o4.mongodb.net/nextgenrail`

## ✨ Features

### 🎫 Booking & Reservations

- **Real-time train search** with fuzzy station matching
- **Interactive seat map** with visual berth selection
- **Multi-quota support**: General, Tatkal, Ladies, Senior Citizen
- **Waitlist management** with AI-powered confirmation prediction
- **PNR status tracking** with live updates via WebSockets

### 🔐 Security & Authentication  

- **OTP-based login** with email verification
- **JWT authentication** with refresh token rotation
- **Mock Aadhaar KYC** integration for user verification
- **CSRF protection** and secure session management

### 📱 User Experience

- **Material UI** with IRCTC-inspired theme
- **Progressive Web App** support
- **Dark mode** toggle
- **Responsive design** for mobile and desktop
- **Accessibility** compliance with ARIA standards

### ⚡ Performance & Reliability

- **Caching layer** with Caffeine for optimal response times
- **WebSocket connections** for real-time updates
- **Async event processing** for notifications
- **Comprehensive audit logging**

## 🏗️ Architecture

### Monorepo Structure

```txt
/nextgenrail
├── apps/
│   ├── web/          # React 18.3.1 + TypeScript + Material UI
│   └── api/          # Spring Boot 3.4.9 + MongoDB + JWT
├── infra/            # Docker configs, deployment scripts
├── docker-compose.yml
└── package.json      # Workspace management
```

### Tech Stack

- **Frontend**: React 18.3.1, TypeScript, Material UI, React Router v6, Vite
- **Backend**: Spring Boot 3.4.9, MongoDB, Spring Security, JWT, Maven  
- **Database**: MongoDB Atlas (Cloud), Local MongoDB support
- **DevOps**: Docker, Docker Compose, Render deployment
- **Testing**: JUnit 5, Mockito, Vitest, React Testing Library

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Java 17+
- Docker & Docker Compose
- MongoDB (or use Docker setup)

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nextgenrail
   ```

2. **Start with Docker (Recommended)**

   ```bash
   npm run docker:up
   ```

   This starts:
   - Frontend at <http://localhost:3000>
   - Backend API at <http://localhost:8080>  
   - MongoDB at localhost:27017

3. **Or start manually**

   ```bash
   # Terminal 1: Start backend API
   cd apps/api
   mvn spring-boot:run
   
   # Terminal 2: Start frontend
   cd apps/web
   npm install
   npm run dev
   ```

4. **Seed database with sample data**

   ```bash
   npm run seed:db
   ```

### Environment Variables

Create these files:

- `apps/api/src/main/resources/application-dev.yml`
- `apps/web/.env.local`

See `/infra/env-templates/` for examples.

## 📚 API Documentation

Once running, visit:

- **Swagger UI**: <http://localhost:8080/api/swagger-ui.html>
- **API Docs**: <http://localhost:8080/api/api-docs>

### Key Endpoints

```txt
POST /api/auth/otp-login       # Email OTP authentication
POST /api/auth/verify-otp      # Verify OTP and get tokens
GET  /api/trains/search        # Search trains between stations
GET  /api/availability         # Check seat availability
POST /api/bookings             # Create new booking
GET  /api/bookings/{pnr}       # PNR status inquiry
PUT  /api/bookings/{pnr}/cancel # Cancel booking
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Backend tests only
npm run test:api

# Frontend tests only  
npm run test:web
```

## 🐳 Docker Deployment

### Build images

```bash
npm run docker:build
```

### Production deployment

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## ☁️ Render Deployment

### Backend (Web Service)

- **Build Command**: `cd apps/api && ./mvnw clean package`
- **Start Command**: `cd apps/api && java -jar target/nextgenrail-api-1.0.0.jar`
- **Environment**: Java 17

### Frontend (Static Site)  

- **Build Command**: `cd apps/web && npm install && npm run build`
- **Publish Directory**: `apps/web/dist`

### Database

- MongoDB Atlas (recommended for production)
- Or Render PostgreSQL with document storage patterns

See `/infra/render/` for detailed deployment configs.

## 📊 Database Schema

### Collections

- **users** - User profiles with encrypted Aadhaar
- **trains** - Train schedules and route information  
- **bookings** - Reservation records with seat allocation
- **notifications** - Booking updates and alerts
- **audit_logs** - Security and transaction logging

## 🔧 Development Scripts

```bash
npm run dev          # Start both frontend and backend
npm run build        # Build for production
npm run docker:up    # Start with Docker Compose
npm run seed:db      # Populate with sample data
npm test            # Run test suites
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

MIT License - see LICENSE file for details.

## 🛟 Support

- **Documentation**: `/docs` folder
- **Issues**: GitHub Issues
- **Email**: <support@nextgenrail.com>

---

Built with ❤️ by the NextGenRail Team
