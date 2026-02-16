# Accounting & Advisory Platform

A comprehensive MERN stack web application for managing recruitment and employee onboarding for an accounting and advisory firm.

## Features

### Public Features
- **Professional Landing Page** - Showcases services and company information
- **Interest Form** - Quick form for candidates to express interest (~20% profile)
- **Exited Form** - Comprehensive application form with auto-fetch capability (~50% profile)
- **Auto-fetch Logic** - Existing candidates can auto-populate data from interest form

### Authentication & Roles
- **Admin** - Full access to manage candidates and system
- **Advisor** - Can view and manage candidate details
- **Client** - View-only access (placeholder for future)
- **Employee** - Access to personal dashboard for final confirmation

### Admin Panel
- **Dashboard** - Overview of recruitment statistics
- **Candidate Management** - View, filter, and manage all candidates
- **Status Management** - Move candidates through workflow stages
- **Approval System** - Generate employee IDs and credentials

### Workflow Stages
1. **INTERESTED** (20%) - Initial interest form submitted
2. **ALLOWED_EXITED** (20%) - Admin allows candidate to fill exited form
3. **EXITED** (50%) - Comprehensive application submitted
4. **APPROVED** (80%) - Admin approves and generates credentials
5. **ACTIVE** (100%) - Employee confirms and activates profile

## Tech Stack

### Backend
- **Node.js** & **Express.js** - Server and API
- **MongoDB** & **Mongoose** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Express Validator** - Input validation

### Frontend
- **React.js** - UI framework
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **Zustand** - State management
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Icons** - Icons

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/accounting_advisory
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=30d
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

4. Seed admin user:
```bash
node seeders/seedAdmin.js
```

Default admin credentials:
- Email: admin@accounting.com
- Password: admin123

5. Start the backend server:
```bash
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:5173

### Run Both Servers Concurrently

From the root directory:

1. Install root dependencies:
```bash
npm install
```

2. Install all dependencies:
```bash
npm run install-all
```

3. Run both servers:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (Admin only)
- `POST /api/auth/login` - Login for admin/advisor/client
- `POST /api/auth/employee-login` - Login for employees
- `GET /api/auth/me` - Get current user

### Candidates
- `POST /api/candidates/interest` - Submit interest form (Public)
- `POST /api/candidates/check` - Check existing candidate (Public)
- `POST /api/candidates/exited` - Submit exited form (Public)
- `GET /api/candidates` - Get all candidates (Auth)
- `GET /api/candidates/:id` - Get candidate details (Auth)
- `PUT /api/candidates/:id/allow-exited` - Allow exited form (Admin)
- `POST /api/candidates/:id/approve` - Approve candidate (Admin)
- `PUT /api/candidates/:id/admin-update` - Update admin fields (Admin)
- `PUT /api/candidates/:id/final-confirmation` - Final confirmation (Employee)
- `GET /api/candidates/stats` - Get statistics (Admin)
- `DELETE /api/candidates/:id` - Delete candidate (Admin)

### Uploads
- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files

## Database Schema

### User Model
- Basic authentication for admin, advisors, and clients
- Role-based access control

### Candidate Model
Single comprehensive model tracking entire journey:
- Personal information (interest form)
- Extended personal info (exited form)
- Contact information
- Family background
- Education (basic and detailed)
- Work experience (basic and detailed)
- Professional interests
- References
- Documents
- Admin fields (employee ID, credentials)
- Contract and legal compliance
- Final confirmation
- Status and profile percentage tracking

## Key Features Implementation

### Auto-fetch Logic
When filling the exited form, candidates can enter their email or mobile number. The system automatically:
1. Checks for existing records
2. Pre-fills personal information from interest form
3. Locks pre-filled fields (read-only)
4. Allows filling only additional fields

### Profile Percentage Tracking
- INTERESTED: 20%
- ALLOWED_EXITED: 20%
- EXITED: 50%
- APPROVED: 80%
- ACTIVE: 100%

### Employee ID Generation
Format: `EMP{YEAR}{4-digit-number}`
Example: EMP20240001, EMP20240002, etc.

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization
- Input validation
- Rate limiting
- Helmet security headers
- CORS configuration

## Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Update MONGO_URI to production database
3. Set strong JWT_SECRET
4. Configure file upload paths
5. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Update API URL in environment
2. Build the production bundle:
```bash
npm run build
```
3. Deploy to Vercel, Netlify, or similar platforms

## Future Enhancements

- Document upload with cloud storage (AWS S3, Cloudinary)
- Email notifications for status changes
- SMS notifications for important updates
- Advanced filtering and search
- Export candidates data to Excel/PDF
- Interview scheduling system
- Performance reviews module
- Payroll integration
- Client portal with actual features
- Mobile responsive improvements
- Dark mode support

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For support, email: support@accountech.com

## Authors

AccounTech Advisory Development Team
