# Deployment Guide

This guide covers deploying the Accounting & Advisory Platform to production.

## 📋 Pre-Deployment Checklist

### Security
- [ ] Change default admin password
- [ ] Update JWT_SECRET to a strong, random value
- [ ] Review and update CORS origins
- [ ] Enable HTTPS
- [ ] Set NODE_ENV to 'production'
- [ ] Remove console.logs from production code
- [ ] Set secure cookie flags

### Configuration
- [ ] Set up production database (MongoDB Atlas recommended)
- [ ] Configure environment variables
- [ ] Set up file storage (AWS S3 or Cloudinary)
- [ ] Configure email service (SendGrid, AWS SES)
- [ ] Set up logging service (Winston, LogRocket)
- [ ] Configure monitoring (PM2, New Relic)

### Testing
- [ ] Run all manual tests
- [ ] Test in production-like environment
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Browser compatibility tested

## 🚀 Deployment Options

### Option 1: Traditional VPS (DigitalOcean, AWS EC2, Linode)

#### Backend Deployment

1. **Setup Server**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2
sudo npm install -g pm2
```

2. **Deploy Backend**
```bash
# Clone repository
git clone <your-repo-url>
cd accounting-advisory-platform/backend

# Install dependencies
npm install --production

# Set environment variables
nano .env
# Update with production values

# Seed admin user
node seeders/seedAdmin.js

# Start with PM2
pm2 start server.js --name accounting-backend
pm2 save
pm2 startup
```

3. **Setup Nginx**
```bash
sudo apt install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/accounting-api
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/accounting-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

#### Frontend Deployment

1. **Build Frontend**
```bash
cd frontend
npm install
npm run build
```

2. **Deploy to Nginx**
```bash
# Copy build files
sudo cp -r dist/* /var/www/accounting-frontend/

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/accounting-frontend
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/accounting-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/accounting-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Option 2: Vercel (Frontend) + Railway (Backend)

#### Railway Deployment (Backend)

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy on Railway**
- Go to railway.app
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your repository
- Add environment variables:
  - NODE_ENV=production
  - MONGO_URI=<your-mongodb-atlas-uri>
  - JWT_SECRET=<strong-secret>
  - PORT=5000
- Railway will automatically deploy

3. **Setup MongoDB Atlas**
- Go to mongodb.com/cloud/atlas
- Create free cluster
- Get connection string
- Add to Railway environment variables

#### Vercel Deployment (Frontend)

1. **Update API URL**
```bash
# Create .env.production
echo "VITE_API_URL=https://your-railway-app.up.railway.app/api" > frontend/.env.production
```

2. **Deploy to Vercel**
- Go to vercel.com
- Import your repository
- Set root directory to `frontend`
- Add environment variable: VITE_API_URL
- Deploy

### Option 3: Heroku (Full Stack)

#### Backend
```bash
cd backend

# Create Procfile
echo "web: node server.js" > Procfile

# Login to Heroku
heroku login

# Create app
heroku create accounting-backend

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main

# Seed admin
heroku run node seeders/seedAdmin.js
```

#### Frontend
```bash
cd frontend

# Install serve
npm install -g serve

# Create Procfile
echo "web: serve -s dist -l $PORT" > Procfile

# Build
npm run build

# Create app
heroku create accounting-frontend

# Set backend URL
heroku config:set VITE_API_URL=https://accounting-backend.herokuapp.com/api

# Deploy
git push heroku main
```

## 🔒 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_very_strong_secret_key_here_min_32_chars
JWT_EXPIRE=30d
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
CLIENT_URL=https://yourdomain.com
```

### Frontend (.env.production)
```env
VITE_API_URL=https://api.yourdomain.com/api
```

## 📊 Post-Deployment

### 1. Verify Deployment
```bash
# Test backend health
curl https://api.yourdomain.com/api/health

# Test frontend
curl https://yourdomain.com
```

### 2. Monitor Application
```bash
# With PM2
pm2 monit

# View logs
pm2 logs accounting-backend

# Check status
pm2 status
```

### 3. Setup Monitoring
- Use PM2 Plus for monitoring
- Setup LogRocket for frontend errors
- Configure Sentry for error tracking
- Setup Google Analytics

### 4. Backup Strategy
```bash
# Automated MongoDB backups
# Create backup script
nano /home/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="mongodb://localhost:27017/accounting_advisory" --out=/backups/$DATE
find /backups -type d -mtime +7 -exec rm -rf {} \;
```

```bash
chmod +x /home/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /home/backup-db.sh
```

## 🔄 CI/CD Setup (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend
```

## 🛡️ Security Hardening

### 1. Update Backend Security
```javascript
// backend/server.js - Add security middleware
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent HTTP parameter pollution
app.use(hpp());
```

### 2. Setup Firewall
```bash
# UFW firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 📈 Performance Optimization

### 1. Enable Gzip Compression
Already enabled in backend with `compression` middleware.

### 2. Setup CDN
- Use Cloudflare for CDN
- Cache static assets
- Enable DDoS protection

### 3. Database Optimization
```javascript
// Add to backend/models/Candidate.js
candidateSchema.index({ status: 1, createdAt: -1 });
candidateSchema.index({ 'contactInfo.email': 1 });
candidateSchema.index({ 'personalInfo.primaryContact.number': 1 });
```

## 🔍 Monitoring & Logging

### 1. Setup Winston Logger
```bash
cd backend
npm install winston
```

### 2. Error Tracking
- Integrate Sentry
- Setup error alerts
- Monitor API response times

## 📱 Domain Setup

### 1. Configure DNS
- Point A record to server IP
- Setup www redirect
- Configure SSL

### 2. SSL Certificate
```bash
# Automatic renewal check
sudo certbot renew --dry-run

# Setup auto-renewal
sudo crontab -e
0 0 * * * certbot renew --quiet
```

## 🎉 Launch Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] Database configured and secured
- [ ] SSL certificates installed
- [ ] Admin user created
- [ ] Environment variables set
- [ ] Monitoring setup
- [ ] Backups configured
- [ ] Security hardening complete
- [ ] Performance tested
- [ ] DNS configured
- [ ] Email service working
- [ ] Error tracking active

## 🆘 Troubleshooting

### Backend not starting
```bash
# Check logs
pm2 logs accounting-backend

# Restart
pm2 restart accounting-backend

# Check environment variables
pm2 env 0
```

### Frontend errors
```bash
# Check build
npm run build

# Test locally
npm run preview

# Check API connection
curl https://api.yourdomain.com/api/health
```

### Database connection issues
```bash
# Test MongoDB
mongosh "mongodb+srv://cluster.mongodb.net/test" --username user

# Check network access in MongoDB Atlas
```

## 📚 Resources

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)

---

**Need help?** Check the documentation or contact support.
