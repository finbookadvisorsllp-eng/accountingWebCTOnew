# Multi-Level Hierarchical Accountant Management Platform

A comprehensive, enterprise-grade accounting management system designed for chartered accountants and their teams to manage clients, accountants, and multiple businesses in a hierarchical structure.

## 🏗️ System Architecture

```
CA (Level 0)
   ├── Senior Accountant (Level 1)
   │        ├── Junior Accountant (Level 2)
   │        │         ├── Clients
   │        │               ├── Businesses
   │        ├── Clients
   │               ├── Businesses
   ├── Clients
          ├── Businesses
```

## ✨ Key Features

### 🔐 Role-Based Access Control
- **CA (Chartered Accountant)**: Full system access, user management, hierarchy control
- **Senior Accountant**: Manage own clients, businesses, and junior accountants
- **Junior Accountant**: Manage assigned clients and businesses
- **Client**: View own businesses and assigned accountant information

### 📊 Hierarchical Management
- Multi-level user hierarchy with parent-child relationships
- Parent users can access child data and activities
- Child users can only access their own and subordinate data
- Recursive access control with proper permission validation

### 🏢 Multi-Business Support
- Each client can have multiple businesses
- Separate GST, PAN, compliance tracking per business
- Business-level assignment to accountants
- Comprehensive compliance monitoring

### 👥 Client Management
- CA-controlled client onboarding (no self-registration)
- Client profile management with contact details
- Company information and compliance tracking
- Client assignment to accountants
- Status management (Active/Inactive/Pending Activation)

### 📈 Dashboard & Analytics
- Role-based custom dashboards
- Real-time compliance status monitoring
- Business performance metrics
- Team hierarchy visualization
- Activity tracking and audit logs

### 🔒 Security & Compliance
- JWT-based authentication
- Hierarchical data access control
- Comprehensive audit logging
- Password security with forced changes
- Status-based account management

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (v4.4+)
- React.js (v18+)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ca-platform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm run seed  # Seed initial data
   npm run dev   # Start development server
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev   # Start development server
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| CA | admin@ca.com | Admin@123 |
| Senior Accountant | senior@ca.com | Senior@123 |
| Junior Accountant | junior@ca.com | Junior@123 |
| Client | client1@example.com | Client@123 |

## 📋 API Documentation

### Authentication Endpoints

```http
POST /api/auth/login
POST /api/auth/register
GET /api/auth/me
POST /api/auth/change-password
POST /api/auth/activate-client
POST /api/auth/logout
```

### User Management

```http
GET /api/users                 # Get users (hierarchical access)
GET /api/users/:id             # Get single user
PUT /api/users/:id             # Update user
DELETE /api/users/:id          # Delete user (CA only)
POST /api/users/:id/assign     # Assign subordinate
GET /api/users/hierarchy/tree  # Get hierarchy tree
```

### Client Management

```http
POST /api/clients              # Create client (CA only)
GET /api/clients               # Get clients
GET /api/clients/:id           # Get single client
PUT /api/clients/:id           # Update client
DELETE /api/clients/:id        # Delete client (CA only)
POST /api/clients/:id/assign   # Assign client to accountant
GET /api/clients/stats         # Get client statistics
```

### Business Management

```http
POST /api/businesses           # Create business
GET /api/businesses            # Get businesses
GET /api/businesses/:id        # Get single business
PUT /api/businesses/:id        # Update business
DELETE /api/businesses/:id     # Delete business (CA only)
POST /api/businesses/:id/assign # Assign business to accountant
GET /api/businesses/stats      # Get business statistics
```

### Dashboard

```http
GET /api/dashboard             # Get role-based dashboard data
GET /api/dashboard/hierarchy   # Get hierarchy visualization
GET /api/dashboard/activities  # Get recent activities
```

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (CA | ACCOUNTANT | CLIENT),
  level: Number,
  parentId: ObjectId (ref: Users),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  status: String (ACTIVE | INACTIVE | PENDING_ACTIVATION),
  mustChangePassword: Boolean,
  employeeId: String (unique),
  createdBy: ObjectId (ref: Users),
  createdAt: Date,
  updatedAt: Date
}
```

### ClientProfiles Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users, unique),
  contactPerson: {
    name: String,
    designation: String,
    email: String,
    phone: String
  },
  companyDetails: {
    registrationNumber: String,
    incorporationDate: Date,
    companyType: String,
    industryType: String,
    financialYearStart: String
  },
  complianceDetails: {
    gstRegistered: Boolean,
    panNumber: String,
    tanNumber: String,
    cinNumber: String
  },
  assignedTo: ObjectId (ref: Users),
  status: String (ACTIVE | INACTIVE | ON_HOLD),
  createdBy: ObjectId (ref: Users),
  createdAt: Date,
  updatedAt: Date
}
```

### Businesses Collection
```javascript
{
  _id: ObjectId,
  clientId: ObjectId (ref: ClientProfiles),
  businessName: String,
  businessType: String,
  registrationDetails: {
    registrationNumber: String,
    incorporationDate: Date,
    registrationAuthority: String
  },
  taxDetails: {
    panNumber: String,
    tanNumber: String,
    gstNumber: String,
    cinNumber: String
  },
  address: {
    registered: { street, city, state, zipCode, country },
    operational: { street, city, state, zipCode, country }
  },
  financialDetails: {
    turnover: Number,
    employeesCount: Number,
    financialYear: String,
    booksMaintained: String
  },
  complianceStatus: {
    gstReturn: { status, lastFiled, nextDue },
    incomeTax: { status, lastFiled, nextDue },
    annualReturn: { status, lastFiled, nextDue }
  },
  assignedTo: ObjectId (ref: Users),
  status: String (ACTIVE | INACTIVE | DORMANT | CLOSED),
  createdBy: ObjectId (ref: Users),
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Joi** - Validation
- **helmet** - Security middleware

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **Zustand** - State management
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Toastify** - Notifications

### Development
- **Vite** - Build tool
- **Nodemon** - Development server
- **ESLint** - Code linting

## 📊 Dashboard Features

### CA Dashboard
- **Total Statistics**: Clients, businesses, accountants overview
- **Accountant Management**: View all accountants with client/business counts
- **Hierarchy Control**: Manage user assignments and hierarchy
- **Compliance Overview**: GST, Income Tax filing status across all businesses
- **Quick Actions**: Create accountants, clients, manage assignments
- **Recent Activity**: Latest user registrations and updates

### Accountant Dashboard
- **Team Management**: View and manage junior accountants
- **Client Assignment**: See assigned clients and their status
- **Business Oversight**: Monitor businesses and compliance status
- **Pending Tasks**: Outstanding compliance work
- **Performance Metrics**: Client and business counts

### Client Dashboard
- **Business Portfolio**: View all owned businesses
- **Compliance Status**: GST and Income Tax filing status
- **Assigned Accountant**: Contact information and support details
- **Profile Management**: Update company and contact information
- **Document Access**: Upload and manage business documents

## 🔐 Security Features

### Authentication & Authorization
- JWT-based authentication with role claims
- Password encryption using bcryptjs
- Session management with token expiration
- Multi-factor authentication ready

### Access Control
- Hierarchical permission system
- Role-based route protection
- Data isolation between hierarchy levels
- Resource-level access validation

### Audit & Compliance
- Comprehensive audit logging
- Activity tracking for all user actions
- Compliance status monitoring
- Security event logging

## 🚦 Development Workflow

### Phase 1: Core Architecture ✅
- [x] Database schema design
- [x] User hierarchy system
- [x] Role-based authentication
- [x] Basic CRUD operations

### Phase 2: Assignment Engine ✅
- [x] Client-to-accountant assignment
- [x] Business-to-accountant assignment
- [x] Hierarchical access control
- [x] Assignment history tracking

### Phase 3: Dashboard System ✅
- [x] Role-based dashboards
- [x] Real-time statistics
- [x] Data visualization
- [x] Responsive design

### Phase 4: Reporting & Analytics ✅
- [x] Compliance reporting
- [x] Performance metrics
- [x] Audit trails
- [x] Activity monitoring

## 📦 Project Structure

```
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seeders/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## 🧪 Testing

### API Testing
```bash
# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@ca.com", "password": "Admin@123"}'

# Test hierarchy access
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer <token>"
```

### Database Seeding
```bash
# Reset and seed database
cd backend
npm run seed
```

## 🚀 Deployment

### Production Environment Variables
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ca_platform
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://yourdomain.com
PORT=5000
```

### Build Commands
```bash
# Backend
npm start

# Frontend
npm run build
```

## 📈 Performance Optimization

### Database Indexes
- User email (unique)
- User role and status
- Hierarchical parent-child relationships
- Client assignment indexes
- Business tax number uniqueness

### Caching Strategy
- JWT token caching
- Dashboard data caching
- Hierarchy tree caching
- User session management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper testing
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Refer to the API documentation

## 🗓️ Roadmap

### Phase 5: Advanced Features
- [ ] Document management system
- [ ] GST return automation
- [ ] Tax calendar integration
- [ ] Email notifications
- [ ] Advanced reporting

### Phase 6: Integration
- [ ] GST portal integration
- [ ] Bank account aggregation
- [ ] E-invoice generation
- [ ] Audit trail reporting
- [ ] Mobile application

---

**Built with ❤️ for the accounting community**