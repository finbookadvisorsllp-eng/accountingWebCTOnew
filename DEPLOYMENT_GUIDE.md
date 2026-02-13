# Complete Deployment Guide
## Accounting & Advisory Platform - MERN Stack

This guide provides step-by-step instructions for deploying your full-stack MERN application to production.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [MongoDB Setup](#mongodb-setup)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Testing the Application](#testing-the-application)
7. [Maintenance](#maintenance)

---

## Prerequisites

Before deploying, ensure you have:

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git
- A hosting platform account (Vercel, Netlify, Heroku, Railway, etc.)

---

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended for Production)

1. **Create a MongoDB Atlas Account**
   - Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a New Cluster**
   - Click "Build a Database"
   - Choose "Shared" (free tier)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose authentication method (username/password)
   - Set username and password
   - Set appropriate privileges (e.g., "Read and write to any database")
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your server's specific IP address
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" and click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user's password
   - Replace `<dbname>` with `accounting_advisory`
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/accounting_advisory?retryWrites=true&w=majority`

### Option 2: Local MongoDB (Development Only)

```bash
# Install MongoDB locally
# For Ubuntu/Debian
sudo apt-get install -y mongodb

# For macOS
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
sudo systemctl start mongodb    # Ubuntu/Debian
brew services start mongodb     # macOS

# Or use Docker
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

---

## Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
cd backend
heroku create your-accounting-api
```

4. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI="your_mongodb_connection_string"
heroku config:set JWT_SECRET="your_secure_jwt_secret_key_minimum_32_characters"
heroku config:set JWT_EXPIRE=30d
heroku config:set CLIENT_URL="https://your-frontend-domain.com"
heroku config:set MAX_FILE_SIZE=5242880
```

5. **Deploy**
```bash
git add .
git commit -m "Prepare for deployment"
git push heroku main
```

6. **Seed Admin User**
```bash
heroku run node seeders/seedAdmin.js
```

### Option 2: Railway

1. **Go to [Railway.app](https://railway.app/)**

2. **Connect GitHub Repository**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` directory

3. **Set Environment Variables**
   - Go to "Variables" tab
   - Add all environment variables from `.env.example`

4. **Deploy**
   - Railway will automatically deploy your backend
   - Note the generated URL

5. **Seed Admin User**
   - Use Railway CLI or the dashboard to run:
```bash
railway run node seeders/seedAdmin.js
```

### Option 3: DigitalOcean App Platform

1. **Create a New App**
   - Go to DigitalOcean dashboard
   - Click "Create" → "Apps"

2. **Connect Repository**
   - Choose GitHub
   - Select your repository

3. **Configure App**
   - Set source directory to `backend`
   - Choose Node.js environment
   - Set build command: `npm install`
   - Set run command: `npm start`

4. **Add Environment Variables**
   - Add all variables from `.env.example`

5. **Deploy**

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy from Frontend Directory**
```bash
cd frontend
vercel
```

4. **Follow prompts:**
   - Set up and deploy? Yes
   - Which scope? Your account
   - Link to existing project? No
   - Project name: accounting-advisory-frontend
   - Directory? ./ (current directory)
   - Override settings? No

5. **Set Environment Variables**
   - Create `frontend/.env.production`:
```bash
VITE_API_URL=https://your-backend-url.com/api
```

6. **Deploy Production**
```bash
vercel --prod
```

### Option 2: Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login to Netlify**
```bash
netlify login
```

3. **Build the Frontend**
```bash
cd frontend
npm run build
```

4. **Deploy**
```bash
netlify deploy --prod
```

5. **Configure Environment Variables**
   - Go to Netlify dashboard
   - Site settings → Environment variables
   - Add: `VITE_API_URL=https://your-backend-url.com/api`

### Option 3: Manual Build + Static Hosting

1. **Create Production Environment File**
```bash
cd frontend
echo "VITE_API_URL=https://your-backend-url.com/api" > .env.production
```

2. **Build the Application**
```bash
npm run build
```

3. **Deploy `dist` folder to:**
   - AWS S3 + CloudFront
   - GitHub Pages
   - Any static file hosting service

---

## Environment Configuration

### Backend Environment Variables

Create or update `backend/.env`:

```env
# Environment
NODE_ENV=production

# Server
PORT=5000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/accounting_advisory?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_at_least_32_characters_long
JWT_EXPIRE=30d

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Frontend URL (for CORS)
CLIENT_URL=https://your-frontend-domain.com
```

### Frontend Environment Variables

Create `frontend/.env.production`:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

---

## Testing the Application

### 1. Seed Admin User

After backend deployment:

```bash
# If using Heroku
heroku run node seeders/seedAdmin.js

# If using Railway
railway run node seeders/seedAdmin.js

# If using SSH to your server
ssh your-server
cd /path/to/backend
node seeders/seedAdmin.js
```

Default admin credentials:
- **Email:** admin@accounting.com
- **Password:** admin123

**⚠️ Important:** Change these credentials immediately after first login!

### 2. Test Public Forms

Visit your frontend URL and test:

1. **Landing Page**
   - Check all links work
   - Verify navigation
   - Test responsive design

2. **Interest Form**
   - Go to `/interest-form`
   - Fill out all required fields
   - Submit and verify success message
   - Check if data appears in admin panel

3. **Exited Form**
   - Go to `/exited-form`
   - Test auto-fetch: enter email/phone from interest form
   - Verify pre-filled fields are read-only
   - Fill remaining fields
   - Submit and verify

### 3. Test Admin Panel

1. **Login**
   - Go to `/login`
   - Use admin credentials
   - Verify redirect to dashboard

2. **Dashboard**
   - Check statistics display correctly
   - Verify all cards are clickable
   - Test quick actions

3. **Candidate Management**
   - View candidates list
   - Filter by status
   - View candidate details
   - Test status updates:
     - Mark interested candidate as "ALLOWED_EXITED"
     - Approve exited candidates
     - Generate employee credentials

4. **Search and Filters**
   - Test search functionality
   - Filter by different statuses
   - Verify pagination

### 4. Test Employee Portal

1. **Get Employee Credentials**
   - As admin, approve a candidate
   - Note the generated employeeID and password

2. **Employee Login**
   - Go to `/login`
   - Switch to employee login
   - Use employee credentials

3. **Complete Profile**
   - Fill remaining employee fields
   - Upload required documents
   - Complete final confirmation

---

## Maintenance

### Regular Tasks

1. **Database Backups**
   - MongoDB Atlas provides automatic backups
   - For manual backups:
```bash
mongodump --uri="your_mongodb_uri" --out=/backup/path
```

2. **Monitor Logs**
```bash
# Heroku
heroku logs --tail

# Railway
railway logs

# Check error rates and performance
```

3. **Update Dependencies**
```bash
cd backend && npm update
cd ../frontend && npm update
```

4. **Security Updates**
```bash
npm audit
npm audit fix
```

### Scaling Considerations

As your application grows:

1. **Database**
   - Upgrade MongoDB Atlas tier for more storage/performance
   - Add indexes for frequently queried fields
   - Consider sharding for very large datasets

2. **Backend**
   - Add load balancing
   - Implement caching (Redis)
   - Use CDN for file uploads (AWS S3, Cloudinary)

3. **Frontend**
   - Use CDN for static assets
   - Implement code splitting
   - Add service workers for offline functionality

### Monitoring & Analytics

Recommended tools:

1. **Application Performance**
   - New Relic
   - Datadog
   - Sentry (error tracking)

2. **User Analytics**
   - Google Analytics
   - Mixpanel
   - Hotjar (user behavior)

3. **Uptime Monitoring**
   - UptimeRobot
   - Pingdom
   - StatusCake

---

## 🎉 Deployment Complete!

Your Accounting & Advisory Platform is now live!

### Next Steps

1. ✅ Change default admin password
2. ✅ Test all features thoroughly
3. ✅ Set up monitoring and alerts
4. ✅ Configure regular backups
5. ✅ Share login credentials with your team
6. ✅ Start marketing your platform!

### Support

For issues or questions:
- Check application logs
- Review error messages carefully
- Refer to TROUBLESHOOTING.md
- Contact: support@accountech.com

---

## Troubleshooting Common Issues

### Issue: CORS Errors

**Solution:** Ensure `CLIENT_URL` in backend `.env` matches your frontend domain exactly.

```env
CLIENT_URL=https://your-exact-frontend-domain.com
```

### Issue: Database Connection Failed

**Solution:** 
1. Check MongoDB Atlas IP whitelist
2. Verify connection string is correct
3. Ensure password doesn't contain special characters (or encode them)

### Issue: 502 Bad Gateway

**Solution:** Backend might not be running or crashed.
```bash
heroku logs --tail  # Check logs for errors
heroku restart      # Restart the dyno
```

### Issue: Environment Variables Not Working

**Solution:**
1. Verify variables are set in hosting platform
2. Restart the application after setting variables
3. Check variable names match exactly (case-sensitive)

---

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Author:** AccounTech Development Team
