# 🔧 Troubleshooting Guide

Quick solutions to common issues in the Accounting & Advisory Platform.

---

## 🗄️ Database Issues

### MongoDB Connection Failed

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions:**

1. **Check if MongoDB is running:**
   ```bash
   # For system MongoDB
   sudo systemctl status mongod
   
   # For Docker
   docker ps | grep mongodb
   ```

2. **Start MongoDB:**
   ```bash
   # System service
   sudo systemctl start mongod
   
   # Docker
   docker start mongodb
   # or create new container
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

3. **Check connection string in backend/.env:**
   ```env
   # For local MongoDB
   MONGO_URI=mongodb://localhost:27017/accounting_advisory
   
   # For MongoDB Atlas
   MONGO_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/accounting_advisory
   ```

4. **Test connection:**
   ```bash
   # If MongoDB is local
   mongosh
   # or
   mongo
   ```

### MongoDB Atlas Connection Issues

**Error:** `MongooseServerSelectionError: connection <X> to ... closed`

**Solutions:**

1. **Check IP Whitelist:**
   - Go to MongoDB Atlas dashboard
   - Network Access → Add IP Address
   - Add `0.0.0.0/0` (allow from anywhere) for development
   - Add specific IPs for production

2. **Verify credentials:**
   - Check username/password in connection string
   - Special characters in password should be URL-encoded
   - Example: `@` becomes `%40`, `#` becomes `%23`

3. **Check database name:**
   ```
   mongodb+srv://user:pass@cluster.mongodb.net/accounting_advisory
                                                    ^^^^^^^^^^^^^^^^
                                                    Must match your DB
   ```

---

## 🔌 Port Issues

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solutions:**

1. **Find and kill the process (Linux/Mac):**
   ```bash
   # For backend (port 5000)
   sudo lsof -ti:5000 | xargs kill -9
   
   # For frontend (port 5173)
   sudo lsof -ti:5173 | xargs kill -9
   ```

2. **Windows:**
   ```cmd
   # Find process using port
   netstat -ano | findstr :5000
   
   # Kill process (replace PID)
   taskkill /PID <PID> /F
   ```

3. **Change port in .env:**
   ```env
   # backend/.env
   PORT=5001
   ```

---

## 🔐 Authentication Issues

### JWT Token Invalid

**Error:** `JsonWebTokenError: invalid token`

**Solutions:**

1. **Clear browser storage:**
   ```javascript
   // Open browser console (F12)
   localStorage.clear();
   sessionStorage.clear();
   // Refresh page
   ```

2. **Check JWT_SECRET in backend/.env:**
   ```env
   JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters
   ```

3. **Regenerate token by logging in again**

### Cannot Login

**Error:** `Invalid credentials` or `User not found`

**Solutions:**

1. **Verify admin user exists:**
   ```bash
   cd backend
   node seeders/seedAdmin.js
   ```

2. **Check default credentials:**
   - Email: `admin@accounting.com`
   - Password: `admin123`

3. **Case sensitivity:**
   - Email must be lowercase
   - Password is case-sensitive

4. **Check database connection:**
   - Ensure MongoDB is connected
   - Verify users collection exists

### Employee Login Not Working

**Error:** `Invalid employee credentials`

**Solutions:**

1. **Verify employee credentials:**
   - Employee must be APPROVED status
   - Check Employee ID format: `EMP2024XXXX`
   - Password generated during approval

2. **Admin must generate credentials:**
   - Admin approves candidate
   - System auto-generates Employee ID and password
   - Admin provides these to employee

3. **Check you're on Employee Login:**
   - Must toggle to "Employee Login" mode
   - Not the same as admin login

---

## 🌐 CORS Issues

### CORS Policy Error

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**

1. **Update backend/.env:**
   ```env
   CLIENT_URL=http://localhost:5173
   ```

2. **For production:**
   ```env
   CLIENT_URL=https://your-frontend-domain.com
   ```

3. **Check backend/server.js CORS config:**
   ```javascript
   app.use(cors({
     origin: process.env.CLIENT_URL || 'http://localhost:5173',
     credentials: true
   }));
   ```

4. **Restart backend server** after changing .env

---

## 📁 File Upload Issues

### File Upload Fails

**Error:** `File too large` or `Invalid file type`

**Solutions:**

1. **Check file size limit (default 5MB):**
   ```env
   # backend/.env
   MAX_FILE_SIZE=5242880
   ```

2. **Verify file type:**
   - Allowed: PDF, DOCX, JPG, PNG
   - Check file extension
   - Rename file if needed

3. **Check uploads directory exists:**
   ```bash
   cd backend
   mkdir -p uploads
   ```

4. **Permissions:**
   ```bash
   chmod 755 uploads
   ```

### Cannot View Uploaded Files

**Solutions:**

1. **Check static file serving:**
   ```javascript
   // backend/server.js
   app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
   ```

2. **Access files:**
   ```
   http://localhost:5000/uploads/filename.pdf
   ```

---

## 🎨 Frontend Issues

### Blank Page / White Screen

**Solutions:**

1. **Check browser console (F12):**
   - Look for JavaScript errors
   - Note the error message

2. **Verify API connection:**
   ```javascript
   // frontend/src/services/api.js
   const API_URL = 'http://localhost:5000/api';
   ```

3. **Check backend is running:**
   ```bash
   curl http://localhost:5000/api/health
   ```

4. **Clear browser cache:**
   - Ctrl+Shift+R (hard refresh)
   - Or clear cache in browser settings

### Styles Not Loading

**Solutions:**

1. **Rebuild Tailwind:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Check tailwind.config.js:**
   ```javascript
   content: [
     "./index.html",
     "./src/**/*.{js,ts,jsx,tsx}",
   ],
   ```

3. **Verify index.css imports Tailwind:**
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

### React Router Not Working

**Solutions:**

1. **For development:**
   - Vite handles this automatically

2. **For production (static hosting):**
   - Configure redirects
   - Example for Netlify (_redirects file):
   ```
   /*    /index.html   200
   ```

---

## 📡 API Issues

### API Returns 404

**Error:** `Cannot GET /api/...`

**Solutions:**

1. **Check endpoint spelling**

2. **Verify route is registered:**
   ```javascript
   // backend/server.js
   app.use('/api/auth', require('./routes/authRoutes'));
   app.use('/api/candidates', require('./routes/candidateRoutes'));
   ```

3. **Check backend is running:**
   ```bash
   curl http://localhost:5000/api/health
   # Should return: {"success":true,"message":"Server is running"}
   ```

### API Returns 500

**Error:** `Internal Server Error`

**Solutions:**

1. **Check backend console:**
   - Look for error stack trace
   - Note the specific error

2. **Common causes:**
   - Database connection issue
   - Missing required fields
   - Invalid data types
   - File system permissions

3. **Check backend logs:**
   ```bash
   # Development
   cd backend
   npm run dev
   # Watch for errors
   ```

### Request Timeout

**Solutions:**

1. **Check network connection**

2. **Verify backend is responsive:**
   ```bash
   curl http://localhost:5000/api/health
   ```

3. **Check MongoDB is responsive:**
   ```bash
   mongosh
   # or
   mongo
   ```

4. **Increase timeout in frontend:**
   ```javascript
   // frontend/src/services/api.js
   axios.defaults.timeout = 10000; // 10 seconds
   ```

---

## 🔒 Security Issues

### JWT Expired

**Error:** `jwt expired`

**Solutions:**

1. **Login again** (tokens expire after 30 days by default)

2. **Change expiry in backend/.env:**
   ```env
   JWT_EXPIRE=90d
   ```

### Unauthorized Access

**Error:** `Not authorized to access this route`

**Solutions:**

1. **Verify you're logged in:**
   ```javascript
   // Check localStorage
   localStorage.getItem('token')
   ```

2. **Check user role:**
   - Some routes require specific roles
   - Admin vs Advisor vs Employee

3. **Token might be invalid:**
   - Clear storage and login again

---

## 📊 Form Issues

### Form Validation Errors

**Solutions:**

1. **Check required fields:**
   - Look for fields marked with `*`
   - All required fields must be filled

2. **Check field formats:**
   - Email: must be valid email format
   - Phone: must be numbers only
   - Date: must be valid date

3. **Clear form and retry:**
   - Refresh page
   - Fill form again

### Auto-fetch Not Working

**Error:** `No existing record found`

**Solutions:**

1. **Verify email/phone exactly matches:**
   - Case-sensitive
   - No extra spaces
   - Same as used in Interest Form

2. **Check candidate status:**
   - Must be INTERESTED or ALLOWED_EXITED
   - Admin might not have allowed yet

3. **Check backend logs:**
   ```bash
   # Look for check candidate request
   cd backend
   npm run dev
   ```

### Form Submission Fails

**Solutions:**

1. **Check all required fields are filled**

2. **Check file uploads:**
   - Files not too large
   - Correct file types

3. **Check backend is running:**
   ```bash
   curl http://localhost:5000/api/health
   ```

4. **Check network tab in browser (F12):**
   - Look at request/response
   - Note error message

---

## 💾 Data Issues

### Candidate Not Appearing in Admin Panel

**Solutions:**

1. **Refresh the page**

2. **Check filters:**
   - Clear all filters
   - Select "All Candidates"

3. **Check database:**
   ```bash
   mongosh accounting_advisory
   db.candidates.find({}).pretty()
   ```

4. **Verify candidate was actually created:**
   - Check browser console for errors
   - Check backend logs

### Profile Percentage Not Updating

**Solutions:**

1. **Profile percentage is auto-calculated based on status:**
   - INTERESTED: 20%
   - ALLOWED_EXITED: 20%
   - EXITED: 50%
   - APPROVED: 80%
   - ACTIVE: 100%

2. **Check candidate status:**
   ```bash
   mongosh accounting_advisory
   db.candidates.findOne({email: "candidate@email.com"})
   ```

3. **This is backend logic - frontend only displays it**

---

## 🚀 Deployment Issues

### Heroku Deployment Fails

**Solutions:**

1. **Check Procfile exists:**
   ```
   web: node server.js
   ```

2. **Set environment variables in Heroku:**
   ```bash
   heroku config:set MONGO_URI="your_connection_string"
   heroku config:set JWT_SECRET="your_secret"
   ```

3. **Check Heroku logs:**
   ```bash
   heroku logs --tail
   ```

### Vercel Deployment Issues

**Solutions:**

1. **Build command:**
   ```json
   {
     "scripts": {
       "build": "vite build"
     }
   }
   ```

2. **Output directory:** `dist`

3. **Environment variables:**
   - Add in Vercel dashboard
   - `VITE_API_URL=https://your-backend-url.com/api`

### Railway Deployment Issues

**Solutions:**

1. **Check start command:**
   ```json
   {
     "scripts": {
       "start": "node server.js"
     }
   }
   ```

2. **Set environment variables in Railway dashboard**

3. **Check Railway logs for errors**

---

## 🐛 Common Error Messages

### "Cannot read property 'X' of undefined"

**Solutions:**
1. Data not loaded yet - add loading state
2. Check if data exists before accessing
3. Use optional chaining: `data?.property`

### "Network Error"

**Solutions:**
1. Backend not running
2. Wrong API URL
3. CORS issue
4. Firewall blocking connection

### "ValidationError"

**Solutions:**
1. Missing required fields
2. Invalid data format
3. Check Mongoose schema
4. Add all required fields

---

## 🔍 Debugging Tips

### Backend Debugging

1. **Check console output:**
   ```bash
   cd backend
   npm run dev
   # Watch for errors
   ```

2. **Add console.logs:**
   ```javascript
   console.log('Data received:', req.body);
   ```

3. **Use MongoDB Compass:**
   - Visual database browser
   - Check data directly

4. **Test API with cURL:**
   ```bash
   curl http://localhost:5000/api/health
   curl -X POST http://localhost:5000/api/candidates/interest \
     -H "Content-Type: application/json" \
     -d '{"personalInfo": {...}}'
   ```

### Frontend Debugging

1. **Browser DevTools (F12):**
   - Console tab - JavaScript errors
   - Network tab - API calls
   - Application tab - LocalStorage

2. **React DevTools:**
   - Install browser extension
   - Inspect component state

3. **Check API responses:**
   ```javascript
   // Add in api.js
   axios.interceptors.response.use(
     response => {
       console.log('API Response:', response);
       return response;
     }
   );
   ```

---

## 📞 Still Need Help?

### Before Asking for Help

1. ✅ Check this troubleshooting guide
2. ✅ Read the error message carefully
3. ✅ Check browser console (F12)
4. ✅ Check backend logs
5. ✅ Try basic solutions (restart, refresh, logout/login)
6. ✅ Search error message online

### When Asking for Help

Include:
- Exact error message
- What you were trying to do
- Steps to reproduce
- Browser/OS information
- Backend console output
- Frontend console output (F12)
- Screenshots if helpful

### Contact

- **Email:** support@accountech.com
- **GitHub Issues:** Create detailed issue
- **Documentation:** Check all .md files

---

## ✅ Prevention Checklist

Before deploying to production:

- [ ] Test all forms thoroughly
- [ ] Test admin workflow
- [ ] Test employee workflow
- [ ] Check all validations
- [ ] Verify file uploads work
- [ ] Test on different browsers
- [ ] Test on mobile devices
- [ ] Check error handling
- [ ] Verify security settings
- [ ] Update default passwords
- [ ] Configure CORS properly
- [ ] Set up monitoring
- [ ] Enable error logging
- [ ] Test backup/restore

---

**Remember:** Most issues are caused by:
1. Services not running (MongoDB, backend)
2. Configuration errors (.env files)
3. Authentication issues (expired tokens)
4. CORS configuration
5. Missing data or validation errors

**Always check the basics first!** 🔍

---

**Last Updated:** February 2026  
**Version:** 1.0.0
