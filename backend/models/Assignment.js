const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  assignerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assigneeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignmentType: {
    type: String,
    enum: ['USER_TO_USER', 'CLIENT_TO_ACCOUNTANT', 'BUSINESS_TO_ACCOUNTANT'],
    required: true
  },
  entityType: {
    type: String,
    enum: ['USER', 'CLIENT', 'BUSINESS', null],
    default: null
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'REVOKED', 'TRANSFERRED'],
    default: 'ACTIVE'
  },
  notes: {
    type: String,
    trim: true
  },
  effectiveFrom: {
    type: Date,
    default: Date.now
  },
  effectiveTill: {
    type: Date,
    default: null
  },
  previousAssignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    default: null
  }
}, {
  timestamps: true
});

// Indexes
assignmentSchema.index({ assignerId: 1 });
assignmentSchema.index({ assigneeId: 1 });
assignmentSchema.index({ assignmentType: 1 });
assignmentSchema.index({ status: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);