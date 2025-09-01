# 🚆 IRCTC-Clone-App - Next Generation Railway Booking Platform

A modern, production-grade railway booking web application that surpasses traditional IRCTC in UI/UX and reliability. Built with React 18.3.1, Spring Boot 3.4.8, and MongoDB, deployed on Render.com.

## 🎯 Overview

IRCTC-Clone-App is a complete railway booking system featuring:

- 🔍 **Smart Search** with typeahead station search
- 🗺️ **Interactive Seat Maps** with real-time availability
- 💳 **Seamless Booking Flow** with fare breakdown
- 📱 **Mobile-First Design** with responsive Material UI
- ⚡ **Real-time Updates** via WebSockets
- 🎫 **PNR Status & Management** with cancellation support
- 🔮 **Waitlist Prediction** with AI-powered insights

## 🏗️ Architecture

### Monorepo Structure

```txt
IRCTC-Clone-App/
├── apps/
│   ├── web/          # React 18.3.1 + TypeScript + MUI
│   └── api/          # Spring Boot 3.4.8 + MongoDB + JWT
├── infra/
│   ├── mongodb/      # Database initialization scripts
│   └── render/       # Render.com deployment configs
├── docs/             # Documentation
└── docker-compose.yml
```

### Tech Stack

Frontend

- React 18.3.1 with TypeScript 4.9.5
- Material-UI (MUI) 6.1.6 for components
- React Router 6.30.1 for routing
- React Hook Form 7.62.0 for forms
- Axios 1.11.0 with interceptors

Backend

- Java 17 with Spring Boot 3.4.8
- Spring Security 6.2.9 with JWT authentication
- Spring Data MongoDB 3.4.8
- MongoDB Atlas (Free Tier)
- WebSocket support for real-time updates
- Swagger/OpenAPI documentation

DevOps

- Docker multi-stage builds
- Render.com deployment
- MongoDB Atlas integration
- Environment-based configuration

## ⚡ Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Java 17+ (for local development)

### Run Locally

1. **Clone & Environment Setup**

   ```bash
   git clone <repository-url>
   cd IRCTC-Clone-App
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secrets
   ```

2. **Start with Docker**

   ```bash
   docker-compose up --build
   ```

3. **Access Applications**
   - Frontend: <http://localhost:5173>
   - Backend API: <http://localhost:8080>
   - Swagger UI: <http://localhost:8080/swagger-ui.html>

### Manual Development

1. **Start Backend**

   ```bash
   cd apps/api
   ./mvnw spring-boot:run
   ```

2. **Start Frontend**

   ```bash
   cd apps/web
   npm install
   npm run dev
   ```

## 🚀 Deployment

### Render.com Deployment

1. **Fork Repository** on GitHub
2. **Connect to Render** and create new services
3. **Configure Environment Variables** (see docs/DEPLOY_RENDER.md)
4. **Deploy** using the provided render.yaml

See [DEPLOY_RENDER.md](docs/DEPLOY_RENDER.md) for detailed deployment instructions.

## 📚 Documentation

- [API Contract](docs/API_CONTRACT.md) - Complete API reference
- [Data Model](docs/DATA_MODEL.md) - MongoDB collections and schemas
- [Local Development](docs/RUNLOCAL.md) - Development environment setup
- [Render Deployment](docs/DEPLOY_RENDER.md) - Production deployment guide

## 🔧 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGODB_URI` | MongoDB connection string | - | ✅ |
| `JWT_SECRET` | JWT signing secret | - | ✅ |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | - | ✅ |
| `CORS_ALLOWED_ORIGINS` | Frontend URL for CORS | <http://localhost:5173> | ✅ |
| `SERVER_PORT` | Backend server port | 8080 | ❌ |
| `REACT_APP_API_BASE_URL` | API base URL for frontend | <http://localhost:8080> | ✅ |

## 🧪 Testing

```bash
# Backend tests
cd apps/api
./mvnw test

# Frontend tests  
cd apps/web
npm test
```

## 📱 Features

### Core Booking Flow

1. **Search Trains** - Enter source, destination, and date
2. **View Results** - Browse available trains with real-time availability
3. **Select Seats** - Interactive seat map with berth preferences
4. **Enter Details** - Passenger information and contact details
5. **Payment** - Dummy payment gateway simulation
6. **Confirmation** - PNR generation and ticket details

### Advanced Features

- **Multi-City Search** - Book complex journeys
- **Tatkal Booking** - Express booking with higher fares
- **Waitlist Management** - AI-powered confirmation prediction
- **Quota Selection** - Ladies, Senior Citizen, General quotas
- **Cancellation & Refunds** - Rule-based refund calculations
- **Real-time Updates** - Live availability via WebSockets

## 🔐 Security

- Anonymous JWT sessions (no user registration required)
- Secure HttpOnly cookies for refresh tokens
- CORS protection for cross-origin requests
- Input validation and sanitization
- Rate limiting for API endpoints

## 🎨 UI/UX Improvements over IRCTC

- **Modern Material Design** with consistent theming
- **Mobile-First Responsive** layout
- **Intuitive Navigation** with clear user flows
- **Real-time Feedback** with loading states and animations
- **Smart Autocomplete** for station search
- **Visual Seat Maps** for better seat selection
- **Clear Fare Breakdown** with transparent pricing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🛟 Support

- **Issues**: GitHub Issues
- **Documentation**: `/docs` folder
- **API Reference**: `/swagger-ui.html` when running

---

Built with ❤️ for better railway booking experiences
