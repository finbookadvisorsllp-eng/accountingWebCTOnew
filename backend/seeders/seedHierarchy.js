const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const ClientProfile = require('./models/ClientProfile');
const Business = require('./models/Business');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ca_platform';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await ClientProfile.deleteMany({});
    await Business.deleteMany({});
    console.log('Cleared existing data');

    // Create CA (Chartered Accountant)
    const caPassword = await bcrypt.hash('Admin@123', 10);
    const ca = await User.create({
      name: 'CA Admin',
      email: 'admin@ca.com',
      password: caPassword,
      role: 'CA',
      level: 0,
      status: 'ACTIVE',
      phone: '+91-9876543210',
      address: {
        street: '123 CA Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India'
      },
      mustChangePassword: false
    });
    console.log('Created CA:', ca.email);

    // Create Senior Accountant
    const seniorPassword = await bcrypt.hash('Senior@123', 10);
    const seniorAccountant = await User.create({
      name: 'John Senior',
      email: 'senior@ca.com',
      password: seniorPassword,
      role: 'ACCOUNTANT',
      level: 1,
      parentId: ca._id,
      status: 'ACTIVE',
      phone: '+91-9876543211',
      employeeId: 'ACC0001',
      mustChangePassword: false,
      createdBy: ca._id
    });
    console.log('Created Senior Accountant:', seniorAccountant.email);

    // Create Junior Accountant
    const juniorPassword = await bcrypt.hash('Junior@123', 10);
    const juniorAccountant = await User.create({
      name: 'Jane Junior',
      email: 'junior@ca.com',
      password: juniorPassword,
      role: 'ACCOUNTANT',
      level: 2,
      parentId: seniorAccountant._id,
      status: 'ACTIVE',
      phone: '+91-9876543212',
      employeeId: 'ACC0002',
      mustChangePassword: false,
      createdBy: seniorAccountant._id
    });
    console.log('Created Junior Accountant:', juniorAccountant.email);

    // Create Test Client 1
    const client1Password = await bcrypt.hash('Client@123', 10);
    const client1 = await User.create({
      name: 'ABC Solutions Pvt Ltd',
      email: 'client1@example.com',
      password: client1Password,
      role: 'CLIENT',
      level: 2,
      parentId: seniorAccountant._id,
      status: 'ACTIVE',
      phone: '+91-9876543213',
      mustChangePassword: false,
      createdBy: ca._id
    });

    const client1Profile = await ClientProfile.create({
      userId: client1._id,
      contactPerson: {
        name: 'Rajesh Kumar',
        designation: 'Director',
        email: 'rajesh@abcsolutions.com',
        phone: '+91-9876543213'
      },
      companyDetails: {
        companyType: 'PVT_LTD',
        industryType: 'IT Services',
        registrationNumber: 'U72900MH2020PTC123456'
      },
      complianceDetails: {
        gstRegistered: true,
        panNumber: 'AABCU1234R',
        tanNumber: 'MUMU12345'
      },
      assignedTo: seniorAccountant._id,
      assignedBy: ca._id,
      status: 'ACTIVE',
      createdBy: ca._id
    });

    // Create Business for Client 1
    await Business.create({
      clientId: client1Profile._id,
      businessName: 'ABC Solutions - IT Division',
      businessType: 'PVT_LTD',
      registrationDetails: {
        registrationNumber: 'U72900MH2020PTC123456',
        registrationAuthority: 'MCA'
      },
      taxDetails: {
        panNumber: 'AABCU1234R',
        tanNumber: 'MUMU12345',
        gstNumber: '27AABCU1234R1ZN'
      },
      address: {
        registered: {
          street: '123 Tech Park',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001'
        }
      },
      financialDetails: {
        turnover: 50000000,
        employeesCount: 50,
        financialYear: '2024-2025'
      },
      assignedTo: seniorAccountant._id,
      assignedBy: ca._id,
      status: 'ACTIVE',
      createdBy: ca._id
    });

    console.log('Created Client 1 with Business');

    // Create Test Client 2
    const client2Password = await bcrypt.hash('Client@123', 10);
    const client2 = await User.create({
      name: 'XYZ Traders',
      email: 'client2@example.com',
      password: client2Password,
      role: 'CLIENT',
      level: 2,
      parentId: juniorAccountant._id,
      status: 'ACTIVE',
      phone: '+91-9876543214',
      mustChangePassword: false,
      createdBy: ca._id
    });

    const client2Profile = await ClientProfile.create({
      userId: client2._id,
      contactPerson: {
        name: 'Priya Sharma',
        designation: 'Owner',
        email: 'priya@xyztraders.com',
        phone: '+91-9876543214'
      },
      companyDetails: {
        companyType: 'PROPRIETORSHIP',
        industryType: 'Trading'
      },
      complianceDetails: {
        gstRegistered: true,
        panNumber: 'ABCDE5678F'
      },
      assignedTo: juniorAccountant._id,
      assignedBy: seniorAccountant._id,
      status: 'ACTIVE',
      createdBy: ca._id
    });

    // Create Business for Client 2
    await Business.create({
      clientId: client2Profile._id,
      businessName: 'XYZ Traders - Main Business',
      businessType: 'PROPRIETORSHIP',
      taxDetails: {
        panNumber: 'ABCDE5678F',
        gstNumber: '27ABCDE5678F1Z5'
      },
      address: {
        registered: {
          street: '456 Market Road',
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110001'
        }
      },
      financialDetails: {
        turnover: 10000000,
        employeesCount: 10,
        financialYear: '2024-2025'
      },
      assignedTo: juniorAccountant._id,
      assignedBy: seniorAccountant._id,
      status: 'ACTIVE',
      createdBy: ca._id
    });

    console.log('Created Client 2 with Business');

    // Create Inactive Client
    const inactiveClientPassword = await bcrypt.hash('Client@123', 10);
    const inactiveClient = await User.create({
      name: 'Inactive Enterprises',
      email: 'inactive@example.com',
      password: inactiveClientPassword,
      role: 'CLIENT',
      level: 2,
      parentId: seniorAccountant._id,
      status: 'INACTIVE',
      mustChangePassword: true,
      createdBy: ca._id
    });

    await ClientProfile.create({
      userId: inactiveClient._id,
      contactPerson: {
        name: 'Test User',
        designation: 'Manager'
      },
      companyDetails: {
        companyType: 'PVT_LTD'
      },
      status: 'INACTIVE',
      createdBy: ca._id
    });

    console.log('Created Inactive Client');

    console.log('\n✅ Seed completed successfully!');
    console.log('\nLogin Credentials:');
    console.log('CA: admin@ca.com / Admin@123');
    console.log('Senior Accountant: senior@ca.com / Senior@123');
    console.log('Junior Accountant: junior@ca.com / Junior@123');
    console.log('Client 1: client1@example.com / Client@123');
    console.log('Client 2: client2@example.com / Client@123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();