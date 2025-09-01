# 🚀 Render.com Deployment Guide

This guide covers deploying IRCTC-Plus to Render.com with Docker containers.

## Prerequisites

1. **GitHub Repository** with your IRCTC-Plus code
2. **Render.com Account** ([Sign up free](https://render.com/))
3. **MongoDB Atlas** cluster ([Free tier](https://www.mongodb.com/cloud/atlas))

## Deployment Architecture

- **Backend**: Web Service (Docker) at `https://irctc-plus-api.onrender.com`
- **Frontend**: Static Site (Docker) at `https://irctc-plus.onrender.com`
- **Database**: MongoDB Atlas (external)

## Step 1: MongoDB Atlas Setup

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create new cluster (M0 Free tier)
   - Choose region (preferably US East for better Render connectivity)

2. **Configure Network Access**
   - Go to Network Access → IP Whitelist
   - Add `0.0.0.0/0` (Allow access from anywhere)
   - This is required for Render to connect

3. **Create Database User**
   - Go to Database Access → Database Users
   - Create user with read/write permissions
   - Note username and password

4. **Get Connection String**
   - Go to Clusters → Connect → Connect your application
   - Copy connection string: `mongodb+srv://<username>:<password>@cluster.mongodb.net/irctcplus`

## Step 2: Prepare render.yaml

Create `render.yaml` in your repository root:

```yaml
services:
  # Backend API Service
  - type: web
    name: irctc-plus-api
    env: docker
    dockerfilePath: ./apps/api/Dockerfile
    dockerContext: ./apps/api
    plan: free
    region: oregon
    branch: main
    healthCheckPath: /actuator/health
    autoDeploy: true
    envVars:
      - key: SPRING_PROFILES_ACTIVE
        value: prod
      - key: SERVER_PORT
        value: 10000
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: JWT_REFRESH_SECRET
        sync: false
      - key: CORS_ALLOWED_ORIGINS
        value: https://irctc-plus.onrender.com

  # Frontend Web Service
  - type: web
    name: irctc-plus-web
    env: docker
    dockerfilePath: ./apps/web/Dockerfile
    dockerContext: ./apps/web
    plan: free
    region: oregon
    branch: main
    autoDeploy: true
    buildCommand: |
      cd apps/web && 
      npm ci && 
      REACT_APP_API_BASE_URL=https://irctc-plus-api.onrender.com npm run build
    startCommand: npx serve -s build -l 10000
    envVars:
      - key: REACT_APP_API_BASE_URL
        value: https://irctc-plus-api.onrender.com
      - key: REACT_APP_WS_URL
        value: wss://irctc-plus-api.onrender.com
```

## Step 3: Backend Deployment

1. **Connect Repository**
   - Go to Render Dashboard
   - Click "New Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `irctc-plus-api`
   - **Environment**: Docker
   - **Dockerfile Path**: `./apps/api/Dockerfile`
   - **Docker Context**: `./apps/api`
   - **Plan**: Free
   - **Region**: Oregon (recommended for free tier)

3. **Set Environment Variables**

   ```txt
   SPRING_PROFILES_ACTIVE=prod
   SERVER_PORT=10000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/irctcplus
   JWT_SECRET=your-super-secret-jwt-key-at-least-256-bits-long
   JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-at-least-256-bits-long
   CORS_ALLOWED_ORIGINS=https://irctc-plus.onrender.com
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build and deployment (~10-15 minutes)

## Step 4: Frontend Deployment

1. **Create New Static Site**
   - Go to Render Dashboard
   - Click "New Static Site"
   - Connect same GitHub repository

2. **Configure Static Site**
   - **Name**: `irctc-plus-web`
   - **Branch**: main
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`

3. **Set Environment Variables**

   ```txt
   REACT_APP_API_BASE_URL=https://irctc-plus-api.onrender.com
   REACT_APP_WS_URL=wss://irctc-plus-api.onrender.com
   ```

4. **Deploy**
   - Click "Create Static Site"
   - Wait for build and deployment (~5-10 minutes)

## Step 5: Custom Domains (Optional)

1. **Add Custom Domain**
   - Go to service settings
   - Add custom domain (e.g., `irctc-plus.yourdomain.com`)
   - Update DNS records as instructed

2. **Update CORS Origins**
   - Update backend environment variable:

   ```txt
   CORS_ALLOWED_ORIGINS=https://irctc-plus.yourdomain.com
   ```

## Step 6: Post-Deployment Verification

1. **Health Checks**
   - Backend: `https://irctc-plus-api.onrender.com/actuator/health`
   - Frontend: `https://irctc-plus.onrender.com`

2. **API Documentation**
   - Swagger UI: `https://irctc-plus-api.onrender.com/swagger-ui.html`

3. **Test Core Functionality**
   - Station search autocomplete
   - Train search results
   - WebSocket connectivity
   - Booking flow

## Environment Variables Reference

### Backend (API Service)

| Variable | Value | Description |
|----------|-------|-------------|
| `SPRING_PROFILES_ACTIVE` | `prod` | Activates production profile |
| `SERVER_PORT` | `10000` | Render requires port 10000 |
| `MONGODB_URI` | `mongodb+srv://...` | Your Atlas connection string |
| `JWT_SECRET` | `your-secret...` | JWT signing key (256-bit) |
| `JWT_REFRESH_SECRET` | `your-refresh-secret...` | Refresh token key (256-bit) |
| `CORS_ALLOWED_ORIGINS` | `https://irctc-plus.onrender.com` | Frontend URL for CORS |

### Frontend (Static Site)

| Variable | Value | Description |
|----------|-------|-------------|
| `REACT_APP_API_BASE_URL` | `https://irctc-plus-api.onrender.com` | Backend API URL |
| `REACT_APP_WS_URL` | `wss://irctc-plus-api.onrender.com` | WebSocket URL |

## Troubleshooting

### Common Issues

1. **Backend Not Starting**
   - Check logs in Render dashboard
   - Verify MongoDB connection string
   - Ensure JWT secrets are set

2. **Frontend Can't Connect to API**
   - Verify `REACT_APP_API_BASE_URL` is correct
   - Check CORS configuration in backend
   - Test API health endpoint directly

3. **Database Connection Failed**
   - Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
   - Check database user permissions
   - Test connection string locally first

4. **Build Failures**
   - Check Dockerfile syntax
   - Verify all dependencies are in package.json/pom.xml
   - Clear Render build cache and retry

### Performance Optimization

1. **Free Tier Limitations**
   - Services sleep after 15 minutes of inactivity
   - Cold starts can take 30+ seconds
   - Consider upgrading to paid plans for production

2. **Database Optimization**
   - Create proper indexes in MongoDB
   - Use connection pooling
   - Implement caching where appropriate

3. **Frontend Optimization**
   - Enable gzip compression
   - Optimize bundle size
   - Use CDN for static assets

## Monitoring and Maintenance

### Health Monitoring

1. **Uptime Monitoring**
   - Set up external monitoring (UptimeRobot, Pingdom)
   - Monitor both frontend and API endpoints

2. **Log Monitoring**
   - Check Render service logs regularly
   - Set up log aggregation for production

### Security Updates

1. **Dependency Updates**
   - Regularly update npm and Maven dependencies
   - Monitor security advisories

2. **Secret Rotation**
   - Rotate JWT secrets periodically
   - Update database credentials as needed

## Production Readiness Checklist

### Before Going Live

- [ ] All environment variables configured
- [ ] Database connection tested
- [ ] API documentation accessible
- [ ] Core user flows tested
- [ ] Error handling implemented
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificates active
- [ ] Rate limiting enabled

### Launch Day

- [ ] Final smoke tests
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify database operations
- [ ] Test under load
- [ ] Monitor user feedback

## Scaling Considerations

As your application grows:

1. **Upgrade Render Plans**
   - Move to paid plans for better performance
   - Add more memory/CPU resources

2. **Database Scaling**
   - Upgrade MongoDB Atlas tier
   - Implement read replicas
   - Add database indexing

3. **CDN Integration**
   - Use Cloudflare or AWS CloudFront
   - Cache static assets
   - Implement edge computing

For support, check [Render Documentation](https://render.com/docs) or reach out to their support team.
