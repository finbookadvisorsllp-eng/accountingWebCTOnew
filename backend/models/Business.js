const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClientProfile',
    required: true
  },
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    maxlength: [200, 'Business name cannot exceed 200 characters']
  },
  businessType: {
    type: String,
    enum: ['PROPRIETORSHIP', 'PVT_LTD', 'PARTNERSHIP', 'LLP', 'PUBLIC_LTD', 'SINGLE_PERSON_COMPANY', 'OTHER'],
    required: [true, 'Business type is required']
  },
  registrationDetails: {
    registrationNumber: {
      type: String,
      trim: true
    },
    incorporationDate: Date,
    registrationAuthority: String
  },
  taxDetails: {
    panNumber: {
      type: String,
      trim: true,
      uppercase: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please add a valid PAN number']
    },
    tanNumber: {
      type: String,
      trim: true
    },
    gstNumber: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          // GST number validation (15 digits format)
          if (!v) return true; // Optional field
          return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);
        },
        message: 'Please add a valid GST number'
      }
    },
    cinNumber: {
      type: String,
      trim: true
    }
  },
  address: {
    registered: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'India'
      }
    },
    operational: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'India'
      }
    }
  },
  bankDetails: [{
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    branchName: String,
    accountType: {
      type: String,
      enum: ['SAVINGS', 'CURRENT', 'OVERDRAFT', 'OTHER']
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  financialDetails: {
    turnover: {
      type: Number,
      min: 0
    },
    employeesCount: {
      type: Number,
      min: 0
    },
    financialYear: {
      type: String,
      default: '2024-2025'
    },
    booksMaintained: {
      type: String,
      enum: ['ACCURAL', 'CASH', 'HYBRID'],
      default: 'ACCURAL'
    }
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignmentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'DORMANT', 'CLOSED'],
    default: 'ACTIVE'
  },
  complianceStatus: {
    gstReturn: {
      status: {
        type: String,
        enum: ['FILED', 'PENDING', 'OVERDUE', 'EXEMPTED'],
        default: 'PENDING'
      },
      lastFiled: Date,
      nextDue: Date
    },
    incomeTax: {
      status: {
        type: String,
        enum: ['FILED', 'PENDING', 'OVERDUE', 'EXEMPTED'],
        default: 'PENDING'
      },
      lastFiled: Date,
      nextDue: Date
    },
    annualReturn: {
      status: {
        type: String,
        enum: ['FILED', 'PENDING', 'OVERDUE', 'EXEMPTED'],
        default: 'PENDING'
      },
      lastFiled: Date,
      nextDue: Date
    }
  },
  documents: [{
    name: String,
    type: {
      type: String,
      enum: ['GST_CERTIFICATE', 'PAN_CARD', 'INCORPORATION_CERTIFICATE', 'MOA', 'AOA', 'PARTNERSHIP_DEED', 'BANK_STATEMENT', 'AUDIT_REPORT', 'OTHER']
    },
    uploadDate: {
      type: Date,
      default: Date.now
    },
    filePath: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    expiryDate: Date
  }],
  notes: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Compound indexes for performance
businessSchema.index({ clientId: 1, businessName: 1 });
businessSchema.index({ assignedTo: 1 });
businessSchema.index({ 'taxDetails.gstNumber': 1 }, { sparse: true });
businessSchema.index({ status: 1 });

// Text index for search functionality
businessSchema.index({
  businessName: 'text',
  'taxDetails.panNumber': 'text',
  'taxDetails.gstNumber': 'text',
  tags: 'text'
});

module.exports = mongoose.model('Business', businessSchema);