const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN',
      'LOGOUT',
      'PASSWORD_CHANGE',
      'PROFILE_UPDATE',
      'USER_CREATE',
      'USER_UPDATE',
      'USER_DELETE',
      'CLIENT_CREATE',
      'CLIENT_UPDATE',
      'CLIENT_ASSIGN',
      'BUSINESS_CREATE',
      'BUSINESS_UPDATE',
      'BUSINESS_ASSIGN',
      'DOCUMENT_UPLOAD',
      'DOCUMENT_DELETE',
      'ASSIGNMENT_CREATE',
      'ASSIGNMENT_REVOKE',
      'STATUS_CHANGE',
      'ROLE_CHANGE'
    ]
  },
  entityType: {
    type: String,
    enum: ['USER', 'CLIENT', 'BUSINESS', 'ASSIGNMENT', 'DOCUMENT', 'SYSTEM']
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId
  },
  description: {
    type: String,
    required: true
  },
  oldValue: {
    type: mongoose.Schema.Types.Mixed
  },
  newValue: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED'],
    default: 'SUCCESS'
  },
  errorMessage: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for performance and querying
auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);