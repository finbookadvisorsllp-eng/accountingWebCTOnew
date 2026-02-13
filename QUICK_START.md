# Quick Start - Accounting & Advisory Platform

## ⚡ 5-Minute Setup

### Step 1: Prerequisites
Ensure you have:
- Node.js v14+ installed
- MongoDB installed and running
- Git installed

### Step 2: Clone & Setup
```bash
# If you haven't cloned yet
cd /path/to/your/projects

# Navigate to project
cd accounting-advisory-platform

# Run automated setup
chmod +x setup.sh
./setup.sh
```

### Step 3: Start Development
```bash
# Option 1: Start both servers together
npm run dev

# Option 2: Start separately
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### Step 4: Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Admin Login:**
  - Email: admin@accounting.com
  - Password: admin123

## 🎯 Test the Complete Flow

### 1. Submit Interest Form (2 minutes)
1. Go to http://localhost:5173
2. Click "Get Started"
3. Click "I'm Interested"
4. Fill the form with test data:
   - Name: John Doe
   - Email: john@test.com
   - Phone: 1234567890
   - Other fields as desired
5. Submit

### 2. Admin Review (1 minute)
1. Go to http://localhost:5173/login
2. Login as Admin
3. Go to "Candidates"
4. Click on John Doe
5. Click "Allow Exited Form"

### 3. Submit Exited Form (3 minutes)
1. Go to http://localhost:5173/get-started
2. Click "Excited to Work"
3. Enter john@test.com or phone number
4. Click "Check" - Data auto-fills!
5. Complete the additional tabs
6. Submit

### 4. Admin Approval (1 minute)
1. Login as Admin
2. Go to Candidates
3. Click on John Doe
4. Click "Approve & Generate ID"
5. Enter:
   - Designation: Junior Accountant
   - Date of Joining: (today's date)
6. Copy the Employee ID and password shown

### 5. Employee Login (1 minute)
1. Go to http://localhost:5173/login
2. Select "Employee" role
3. Enter Employee ID and password
4. View your profile
5. Click "Confirm & Activate Profile"
6. Status changes to ACTIVE (100%)

## 🎨 Features to Try

### Landing Page
- Professional service showcase
- Responsive design
- Beautiful gradients

### Forms
- Interest Form: 20% profile
- Exited Form: 50% profile with 9 tabs
- Auto-fetch from interest to exited
- Form validation

### Admin Panel
- Dashboard with statistics
- Candidate filtering
- Search functionality
- Status management
- Approval workflow

### Employee Portal
- Profile view
- Progress tracking
- Final confirmation

## 🔧 Common Commands

```bash
# Backend only
cd backend
npm run dev

# Frontend only  
cd frontend
npm run dev

# Seed admin again
cd backend
node seeders/seedAdmin.js

# Check MongoDB
mongosh
use accounting_advisory
db.users.find()
db.candidates.find()

# Clear database
use accounting_advisory
db.dropDatabase()
```

## 📊 Project Structure Quick Reference

```
accounting-advisory-platform/
├── backend/              # Node.js + Express API
│   ├── controllers/      # Business logic
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & uploads
│   └── server.js        # Entry point
│
├── frontend/            # React + Vite app
│   └── src/
│       ├── pages/       # All page components
│       ├── components/  # Reusable components
│       ├── services/    # API calls
│       └── store/       # State management
│
└── docs/               # Documentation
    ├── README.md
    ├── GETTING_STARTED.md
    └── DEPLOYMENT.md
```

## 🚨 Troubleshooting

### Issue: MongoDB not running
```bash
# Start MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # Mac
```

### Issue: Port already in use
```bash
# Find and kill process
lsof -i :5000  # or :5173
kill -9 <PID>
```

### Issue: Dependencies not installed
```bash
# Reinstall all
cd backend && rm -rf node_modules && npm install
cd ../frontend && rm -rf node_modules && npm install
```

### Issue: Admin login not working
```bash
# Re-seed admin
cd backend
node seeders/seedAdmin.js
```

## 📚 Next Steps

1. **Customize Branding**
   - Update company name in frontend/src/pages/Landing.jsx
   - Add your logo
   - Change color scheme in tailwind.config.js

2. **Add Features**
   - Email notifications
   - File uploads to cloud storage
   - Export to PDF functionality

3. **Deploy**
   - See DEPLOYMENT.md for detailed instructions
   - Use Railway for backend
   - Use Vercel for frontend

## 🎓 Learn the Code

### Important Files to Understand

**Backend:**
- `server.js` - Express server setup
- `models/Candidate.js` - Complete data schema
- `controllers/candidateController.js` - Business logic
- `middleware/auth.js` - Authentication logic

**Frontend:**
- `App.jsx` - Routing setup
- `pages/Landing.jsx` - Landing page
- `pages/InterestForm.jsx` - Interest form
- `pages/ExitedForm.jsx` - Exited form with tabs
- `pages/admin/Dashboard.jsx` - Admin dashboard
- `store/authStore.js` - Authentication state

## 💡 Tips

1. **Development**
   - Use React DevTools for debugging
   - Check browser console for errors
   - Use Postman to test API directly

2. **Database**
   - Use MongoDB Compass for visual DB management
   - Connection: mongodb://localhost:27017/accounting_advisory

3. **Hot Reload**
   - Both servers support hot reload
   - Changes reflect automatically

4. **Debugging**
   - Backend logs show in terminal
   - Frontend errors in browser console
   - Check Network tab for API calls

## 🎉 Success Indicators

✅ Backend running on port 5000
✅ Frontend running on port 5173
✅ MongoDB connected
✅ Admin can login
✅ Forms can be submitted
✅ Employee can login with generated ID

## 📞 Getting Help

1. Check GETTING_STARTED.md for detailed setup
2. Review code comments
3. Check browser console for errors
4. Verify MongoDB is running
5. Ensure all environment variables are set

---

**Ready to build something amazing! 🚀**

Default Admin:
- Email: admin@accounting.com  
- Password: admin123
- Please change in production!
