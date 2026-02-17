const mongoose = require('mongoose');

const clientProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  contactPerson: {
    name: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true
    },
    designation: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid contact email'
      ]
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[+]?[\d\s\-\(\)]+$/, 'Please add a valid phone number']
    }
  },
  companyDetails: {
    registrationNumber: String,
    incorporationDate: Date,
    companyType: {
      type: String,
      enum: ['PROPRIETORSHIP', 'PVT_LTD', 'PARTNERSHIP', 'LLP', 'PUBLIC_LTD', 'OTHER']
    },
    industryType: String,
    financialYearStart: {
      type: String,
      default: 'APRIL'
    }
  },
  complianceDetails: {
    gstRegistered: {
      type: Boolean,
      default: false
    },
    panNumber: {
      type: String,
      trim: true,
      uppercase: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please add a valid PAN number']
    },
    tanNumber: String,
    cinNumber: String
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
    enum: ['ACTIVE', 'INACTIVE', 'ON_HOLD'],
    default: 'ACTIVE'
  },
  notes: {
    type: String,
    trim: true
  },
  documents: [{
    name: String,
    type: {
      type: String,
      enum: ['PAN_CARD', 'GST_CERTIFICATE', 'INCORPORATION_CERTIFICATE', 'ADDRESS_PROOF', 'OTHER']
    },
    uploadDate: {
      type: Date,
      default: Date.now
    },
    filePath: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for performance
clientProfileSchema.index({ userId: 1 });
clientProfileSchema.index({ assignedTo: 1 });
clientProfileSchema.index({ status: 1 });

module.exports = mongoose.model('ClientProfile', clientProfileSchema);