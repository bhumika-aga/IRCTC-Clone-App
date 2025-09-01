# 🚀 Local Development Guide

This guide will help you set up IRCTC-Plus for local development on your machine.

## Prerequisites

Ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Java** 17+ ([Download](https://adoptium.net/))
- **Docker** & **Docker Compose** ([Download](https://docs.docker.com/get-docker/))
- **Git** ([Download](https://git-scm.com/))

## Quick Start with Docker

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd irctc-plus
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your MongoDB URI and JWT secrets:

   ```bash
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/irctcplus
   JWT_SECRET=your-super-secret-jwt-key-at-least-256-bits-long
   JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-at-least-256-bits-long
   ```

3. **Start services with Docker**

   ```bash
   docker-compose up --build
   ```

4. **Access the applications**
   - 🌐 **Frontend**: <http://localhost:5173>
   - 🔌 **Backend API**: <http://localhost:8080>
   - 📚 **API Documentation**: <http://localhost:8080/swagger-ui.html>

## Manual Development Setup

For active development with hot reloading:

### Backend Setup

1. **Navigate to API directory**

   ```bash
   cd apps/api
   ```

2. **Build the project**

   ```bash
   ./mvnw clean install
   ```

3. **Run the application**

   ```bash
   ./mvnw spring-boot:run
   ```

   The API will start at <http://localhost:8080>

### Frontend Setup

1. **Navigate to web directory**

   ```bash
   cd apps/web
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

   The web app will start at <http://localhost:5173>

## Development Workflow

### Database Seeding

The application automatically seeds the database with synthetic data on startup. To manually trigger seeding:

```bash
curl -X POST http://localhost:8080/admin/seed-data
```

### API Testing

1. **Swagger UI**: <http://localhost:8080/swagger-ui.html>
2. **Health Check**: <http://localhost:8080/actuator/health>
3. **API Docs JSON**: <http://localhost:8080/v3/api-docs>

### Hot Reloading

- **Backend**: Spring Boot DevTools enables automatic restart
- **Frontend**: Vite provides instant hot module replacement

### Running Tests

Backend Tests

```bash
cd apps/api
./mvnw test
```

Frontend Tests

```bash
cd apps/web
npm test
```

Run All Tests

```bash
# From project root
npm run test:all
```

## Environment Configuration

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SERVER_PORT` | Server port | 8080 |
| `SPRING_PROFILES_ACTIVE` | Active profile | dev |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_REFRESH_SECRET` | Refresh token secret | Required |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | <http://localhost:5173> |

### Frontend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | Backend API URL | <http://localhost:8080> |
| `REACT_APP_WS_URL` | WebSocket URL | ws://localhost:8080 |

## Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   # Kill process using port 8080
   lsof -ti:8080 | xargs kill -9
   
   # Kill process using port 5173
   lsof -ti:5173 | xargs kill -9
   ```

2. **MongoDB Connection Failed**
   - Verify your MongoDB URI in `.env`
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Check your username/password

3. **Docker Build Fails**

   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

4. **Frontend Build Errors**

   ```bash
   # Clear node_modules and reinstall
   cd apps/web
   rm -rf node_modules package-lock.json
   npm install
   ```

### Development Tips

1. **API First Development**
   - Start with backend API design using Swagger
   - Implement endpoints before frontend integration

2. **Component Development**
   - Use Storybook for isolated component development
   - Test components with mock data first

3. **Database Management**
   - Use MongoDB Compass for database inspection
   - Keep track of collection indexes for performance

4. **Real-time Features**
   - Test WebSocket connections with browser dev tools
   - Use WebSocket testing tools for debugging

## IDE Setup

### VS Code Extensions

Recommended extensions for optimal development experience:

- **Java Extension Pack**
- **Spring Boot Extension Pack**
- **ES7+ React/Redux/React-Native snippets**
- **TypeScript Importer**
- **Auto Rename Tag**
- **Prettier - Code formatter**
- **ESLint**

### IntelliJ IDEA Setup

1. Import as Maven project
2. Enable annotation processing for Lombok
3. Configure Spring Boot run configuration
4. Install React/TypeScript plugins

## Performance Optimization

### Backend

- Enable JVM options for development:

  ```bash
  export MAVEN_OPTS="-Xmx2g -XX:+UseG1GC"
  ```

### Frontend

- Use React DevTools for component inspection
- Enable source maps for debugging:

  ```bash
  npm run dev -- --sourcemap
  ```

## Next Steps

Once your local environment is running:

1. Explore the API documentation at `/swagger-ui.html`
2. Test the booking flow end-to-end
3. Check WebSocket connectivity for real-time updates
4. Review the codebase structure and patterns
5. Start implementing new features or fixes

For deployment instructions, see [DEPLOY_RENDER.md](DEPLOY_RENDER.md).
