const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: function() {
      // CA and Accountants need passwords, Clients get generated passwords
      return this.role === 'CA' || this.role === 'ACCOUNTANT';
    },
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: ['CA', 'ACCOUNTANT', 'CLIENT'],
    required: [true, 'Please specify user role']
  },
  level: {
    type: Number,
    default: function() {
      // Set level based on role
      if (this.role === 'CA') return 0;
      if (this.role === 'ACCOUNTANT') return 1;
      if (this.role === 'CLIENT') return 2;
      return 0;
    }
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[+]?[\d\s\-\(\)]+$/, 'Please add a valid phone number']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'PENDING_ACTIVATION'],
    default: 'PENDING_ACTIVATION'
  },
  mustChangePassword: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  employeeId: {
    type: String,
    unique: true,
    sparse: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
