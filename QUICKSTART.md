# ⚡ NextGenRail Quick Start Guide

Get NextGenRail running locally in under 5 minutes!

## 🚀 One-Command Setup

```bash
# Clone and setup
git clone <repository-url>
cd IRCTC-Clone-App
cp .env.example .env

# Edit .env with your MongoDB URI
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/irctcplus

# Start everything with Docker
docker-compose up --build
```

Access Applications:

- 🌐 **Frontend**: <http://localhost:5173>
- 🔌 **API**: <http://localhost:8080>
- 📚 **API Docs**: <http://localhost:8080/swagger-ui.html>

## 📋 Environment Variables Checklist

Copy `.env.example` to `.env` and update:

- [ ] `MONGODB_URI` - Your MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Random 256-bit secret key
- [ ] `JWT_REFRESH_SECRET` - Another random 256-bit secret key

**Generate Secrets:**

```bash
# On macOS/Linux
openssl rand -base64 32

# Or use online generator
# https://generate-secret.now.sh/
```

## 🛠️ Manual Development Setup

### Backend (API)

```bash
cd apps/api
./mvnw spring-boot:run
# Runs on http://localhost:8080
```

### Frontend (Web)

```bash
cd apps/web
npm install
npm run dev  
# Runs on http://localhost:5173
```

## ✅ Verify Installation

1. **Backend Health Check**

   ```bash
   curl http://localhost:8080/actuator/health
   # Should return {"status":"UP"}
   ```

2. **Frontend Load**
   - Visit <http://localhost:5173>
   - Should see NextGenRail homepage

3. **Database Connection**
   - Check API logs for "Database seeding completed"
   - Visit <http://localhost:8080/swagger-ui.html>

4. **Sample API Call**

   ```bash
   curl "http://localhost:8080/stations?q=delhi"
   # Should return station results
   ```

## 🎯 Test Booking Flow

1. **Search Trains**
   - From: New Delhi (NDLS)
   - To: Mumbai CST (CSMT)
   - Date: Any future date

2. **Select Train**
   - Choose "Mumbai Rajdhani Express"
   - Select AC3A class

3. **Book Seats**
   - Add 1-2 passengers
   - Select berth preferences
   - Complete dummy payment

4. **Check PNR Status**
   - Use generated PNR number
   - Verify booking details

## 🚀 Deploy to Render

1. **Fork Repository** on GitHub

2. **Create MongoDB Atlas Cluster**
   - Sign up at <https://cloud.mongodb.com>
   - Create M0 (free) cluster
   - Get connection string

3. **Deploy to Render**
   - Connect GitHub repo to Render
   - Use `infra/render/render.yaml` blueprint
   - Set environment variables in Render dashboard

4. **Verify Deployment**
   - Backend: <https://your-api.onrender.com/actuator/health>
   - Frontend: <https://your-app.onrender.com>

## 🔧 Troubleshooting

### Common Issues

**Port already in use:**

```bash
lsof -ti:8080 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

**MongoDB connection failed:**

- Check your connection string in `.env`
- Ensure IP whitelist includes `0.0.0.0/0`
- Verify username/password

**Docker build fails:**

```bash
docker system prune -a
docker-compose build --no-cache
```

**Frontend won't start:**

```bash
cd apps/web
rm -rf node_modules package-lock.json
npm install
```

### Get Help

- 📚 [Full Documentation](docs/)
- 🐛 [Report Issues](https://github.com/your-repo/issues)  
- 💬 [API Reference](docs/API_CONTRACT.md)
- 🗄️ [Data Model](docs/DATA_MODEL.md)

## 🎉 What's Next?

- Explore the API documentation at `/swagger-ui.html`
- Check real-time updates with WebSocket console
- Try different train routes and booking scenarios
- Review the codebase structure and patterns
- Deploy to production on Render.com

Happy Coding! 🚆✨
