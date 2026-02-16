# Getting Started Guide

This guide will help you set up and run the Accounting & Advisory Platform on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **MongoDB** (Community Edition)
   - Download from: https://www.mongodb.com/try/download/community
   - Verify installation: `mongod --version`

3. **Git**
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

4. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

## Quick Start

### Automated Setup (Linux/Mac)

Run the setup script:

```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Install all backend dependencies
- Install all frontend dependencies
- Create the admin user in the database
- Display the login credentials

### Manual Setup

If you prefer to set up manually or are on Windows:

#### Step 1: Start MongoDB

Open a terminal and start MongoDB:

```bash
# On Linux/Mac
mongod

# On Windows (if added to PATH)
mongod
```

Or start MongoDB as a service:

```bash
# On Linux
sudo systemctl start mongod

# On Mac
brew services start mongodb-community

# On Windows
net start MongoDB
```

#### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

#### Step 3: Configure Environment

The `.env` file is already configured for local development. If you need to change settings:

```bash
# Edit backend/.env
PORT=5000
MONGO_URI=mongodb://localhost:27017/accounting_advisory
JWT_SECRET=accounting_advisory_secret_key_2024_change_in_production
```

#### Step 4: Create Admin User

```bash
# From the backend directory
node seeders/seedAdmin.js
```

This creates an admin user with:
- **Email:** admin@accounting.com
- **Password:** admin123

#### Step 5: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

#### Step 6: Start the Application

**Option 1: Run both servers together**

From the project root:

```bash
npm install
npm run dev
```

**Option 2: Run servers separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

## Accessing the Application

Once both servers are running:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

## Default Login Credentials

### Admin Login
- **URL:** http://localhost:5173/login
- **Email:** admin@accounting.com
- **Password:** admin123
- **Role:** Select "Admin"

**⚠️ Important:** Change the admin password after first login in production!

## Testing the Application

### 1. Test Public Forms

**Interest Form:**
- Go to http://localhost:5173/get-started
- Click "I'm Interested"
- Fill out the interest form
- Submit

**Exited Form:**
- Go to http://localhost:5173/get-started
- Click "Excited to Work"
- Option 1: Enter email/mobile from interest form to auto-fetch data
- Option 2: Fill the complete form from scratch
- Submit

### 2. Test Admin Panel

1. Login as admin
2. View the dashboard statistics
3. Go to "Candidates" to see submitted forms
4. Click on a candidate to view details
5. For INTERESTED candidates: Click "Allow Exited Form"
6. For EXITED candidates: Click "Approve & Generate ID"
7. Note the generated Employee ID and password

### 3. Test Employee Login

1. Go to http://localhost:5173/login
2. Select "Employee" role
3. Enter the Employee ID and password from step 2.6
4. View your profile
5. If status is APPROVED, click "Confirm & Activate Profile"
6. Profile status changes to ACTIVE (100%)

## Project Structure

```
accounting-advisory-platform/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── seeders/         # Database seeders
│   ├── utils/           # Utility functions
│   ├── uploads/         # File uploads (created at runtime)
│   ├── .env             # Environment variables
│   ├── package.json     # Backend dependencies
│   └── server.js        # Entry point
│
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── store/       # State management
│   │   ├── App.jsx      # Main app component
│   │   ├── main.jsx     # Entry point
│   │   └── index.css    # Global styles
│   ├── package.json     # Frontend dependencies
│   └── vite.config.js   # Vite configuration
│
├── .gitignore
├── package.json         # Root package.json
├── README.md            # Project documentation
├── GETTING_STARTED.md   # This file
└── setup.sh             # Automated setup script
```

## Common Issues & Solutions

### Issue 1: MongoDB Connection Failed

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
- Ensure MongoDB is running
- Check if MongoDB is running on the default port (27017)
- Verify MONGO_URI in backend/.env

### Issue 2: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
- Kill the process using the port:
  ```bash
  # Find the process
  lsof -i :5000  # Linux/Mac
  netstat -ano | findstr :5000  # Windows
  
  # Kill the process
  kill -9 <PID>  # Linux/Mac
  taskkill /PID <PID> /F  # Windows
  ```
- Or change the PORT in backend/.env

### Issue 3: Admin User Already Exists

**Error:** `Admin user already exists`

**Solution:**
- This is normal if you've already run the seeder
- Use the existing credentials
- To reset, drop the database:
  ```bash
  mongo
  use accounting_advisory
  db.dropDatabase()
  exit
  ```
  Then run the seeder again

### Issue 4: CORS Errors

**Error:** `Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:5173' has been blocked`

**Solution:**
- Ensure backend is running
- Check CORS configuration in backend/server.js
- Verify the proxy configuration in frontend/vite.config.js

### Issue 5: Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
- Delete node_modules and package-lock.json
- Reinstall dependencies:
  ```bash
  cd backend
  rm -rf node_modules package-lock.json
  npm install
  
  cd ../frontend
  rm -rf node_modules package-lock.json
  npm install
  ```

## Workflow Overview

### Recruitment Flow

```
1. Candidate submits INTEREST FORM
   ↓ (Profile: 20%)
   
2. Admin reviews and marks as ALLOWED_EXITED
   ↓ (Profile: 20%)
   
3. Candidate fills EXITED FORM
   ↓ (Profile: 50%)
   
4. Admin reviews and APPROVES
   ↓ (Profile: 80%)
   - Generates Employee ID
   - Generates temporary password
   
5. Employee logs in and CONFIRMS
   ↓ (Profile: 100%)
   
6. Employee status becomes ACTIVE
```

## API Testing with Postman/Thunder Client

### Health Check
```
GET http://localhost:5000/api/health
```

### Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@accounting.com",
  "password": "admin123",
  "role": "admin"
}
```

### Get Candidates (requires authentication)
```
GET http://localhost:5000/api/candidates
Authorization: Bearer <your_jwt_token>
```

### Get Statistics
```
GET http://localhost:5000/api/candidates/stats
Authorization: Bearer <your_jwt_token>
```

## Development Tips

1. **Hot Reload:** Both backend and frontend support hot reload. Changes will be reflected automatically.

2. **Database GUI:** Use MongoDB Compass to view and manage data visually.
   - Connection string: `mongodb://localhost:27017/accounting_advisory`

3. **API Documentation:** All endpoints are documented in README.md

4. **State Management:** Frontend uses Zustand for state management (lightweight and simple)

5. **Styling:** Uses TailwindCSS utility classes for styling

## Production Deployment

See README.md for deployment instructions.

## Need Help?

- Check README.md for detailed documentation
- Review the code comments
- Check console for error messages
- Ensure all prerequisites are installed
- Verify all servers are running

## Next Steps

1. Customize the landing page with your branding
2. Update email templates (future feature)
3. Configure cloud storage for file uploads
4. Set up SSL certificates for production
5. Configure environment variables for production
6. Set up monitoring and logging

---

**Happy Coding! 🚀**
