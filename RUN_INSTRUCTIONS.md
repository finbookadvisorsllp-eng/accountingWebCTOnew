# CA Platform - Run Instructions

## Prerequisites
- Node.js (v24+)
- MongoDB
- npm

## Setup Instructions

### 1. Environment Setup

#### Backend (.env)
The backend `.env` file should be at `/home/engine/project/backend/.env`:
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ca_platform
JWT_SECRET=ca-platform-super-secret-jwt-key-2024-secure
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

#### Frontend (.env)
The frontend `.env` file should be at `/home/engine/project/frontend/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### 2. Start MongoDB

```bash
# Create data directory
mkdir -p ~/mongodb/data

# Start MongoDB
mongod --dbpath ~/mongodb/data --logpath ~/mongodb/mongod.log --fork
```

### 3. Install Dependencies

```bash
# Install backend dependencies
cd /home/engine/project/backend && npm install

# Install frontend dependencies
cd /home/engine/project/frontend && npm install
```

### 4. Seed Initial CA User

```bash
cd /home/engine/project/backend
node seeders/seedCA.js
```

This will create a CA user with:
- Email: admin@ca.com
- Password: Admin@123
- Role: CA

### 5. Start Backend Server

```bash
cd /home/engine/project/backend
npm start
```

Backend will run on: http://localhost:5000

### 6. Start Frontend Server

```bash
cd /home/engine/project/frontend
npm run dev
```

Frontend will run on: http://localhost:5173

## Accessing the Application

1. Open your browser and go to: http://localhost:5173
2. Login with the CA credentials:
   - Email: admin@ca.com
   - Password: Admin@123

## Project Structure

```
project/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, validation, etc.
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── seeders/         # Database seeders
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/     # API calls
│   │   ├── store/        # State management
│   │   └── App.jsx      # Main router
│   └── index.html
└── package.json
```

## API Endpoints

### Auth
- POST /api/auth/login - User login
- POST /api/auth/register - Register new user
- GET /api/auth/me - Get current user

### Users
- GET /api/users - Get all users
- GET /api/users/:id - Get user by ID
- POST /api/users - Create user
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

### Clients
- GET /api/clients - Get all clients
- GET /api/clients/:id - Get client by ID
- POST /api/clients - Create client
- PUT /api/clients/:id - Update client
- DELETE /api/clients/:id - Delete client

### Businesses
- GET /api/businesses - Get all businesses
- GET /api/businesses/:id - Get business by ID
- POST /api/businesses - Create business
- PUT /api/businesses/:id - Update business
- DELETE /api/businesses/:id - Delete business

### Dashboard
- GET /api/dashboard - Get dashboard data
- GET /api/dashboard/hierarchy - Get hierarchy data

### Audit
- GET /api/audit - Get audit logs

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `ps aux | grep mongod`
- Check MongoDB logs: `tail -f ~/mongodb/mongod.log`
- Verify MongoDB is listening on port 27017: `netstat -an | grep 27017`

### Backend Issues
- Check if backend is running on port 5000: `netstat -an | grep 5000`
- Check backend logs in terminal where it's running
- Verify .env file is configured correctly

### Frontend Issues
- Check if frontend is running on port 5173: `netstat -an | grep 5173`
- Clear browser cache and reload
- Check browser console for errors (F12)
- Verify .env file has correct VITE_API_URL

### Login Issues
- Verify user exists in database: Connect to MongoDB and check `users` collection
- Check email/password are correct
- Ensure user status is "ACTIVE"
- Check backend logs for error messages

## Development

### Running Both Servers Simultaneously

You can run both backend and frontend at the same time using the root package.json:

```bash
cd /home/engine/project
npm run dev
```

This will start both servers concurrently.

### Database Seeding

To re-seed the database with a fresh CA user:
```bash
cd /home/engine/project/backend
node seeders/seedCA.js
```

## Default Credentials

### CA User (Super Admin)
- Email: admin@ca.com
- Password: Admin@123
- Role: CA (Level 0)

This user has full access to all features and can create accountants and clients.

## Features Implemented

### ✅ Authentication & Authorization
- JWT-based authentication
- Role-based access control (CA, Accountant, Client)
- Password hashing with bcrypt
- Protected routes

### ✅ User Management
- Create users (CA, Accountants, Clients)
- Multi-level hierarchy support
- Parent-child relationships
- User status management

### ✅ Client Management
- Create and manage client profiles
- Assign clients to accountants
- Client status tracking

### ✅ Business Management
- Multiple businesses per client
- Business details (GST, PAN, etc.)
- Assign businesses to accountants

### ✅ Dashboard
- Role-based dashboards
- Statistics and summary
- Recent activities

### ✅ Audit Logging
- Track all user actions
- Login/logout tracking
- Error logging

## Support

For issues or questions:
1. Check the logs in both backend and frontend terminals
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check browser console for frontend errors
5. Check backend terminal for API errors

## Security Notes

⚠️ **Important for Production:**
- Change JWT_SECRET in backend .env
- Update default admin password
- Enable HTTPS
- Configure proper CORS settings
- Set up rate limiting
- Add input validation and sanitization
- Implement proper error handling
- Add logging and monitoring
