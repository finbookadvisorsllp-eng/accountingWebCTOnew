const Joi = require('joi');

// Validation middleware factory
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMessages
      });
    }
    
    next();
  };
};

// Common validation patterns
const patterns = {
  email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  phone: /^[+]?[\d\s\-\(\)]+$/,
  panNumber: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  gstNumber: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

// User validation schemas
const userValidation = {
  // User registration (for CA creating accountants)
  register: Joi.object({
    name: Joi.string().required().min(2).max(100).trim(),
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().when('role', {
      is: Joi.string().valid('CA', 'ACCOUNTANT'),
      then: Joi.string().min(8).pattern(patterns.strongPassword).required()
        .messages({
          'string.pattern.base': 'Password must be at least 8 characters with uppercase, lowercase, number and special character'
        }),
      otherwise: Joi.string().optional()
    }),
    role: Joi.string().valid('CA', 'ACCOUNTANT', 'CLIENT').required(),
    phone: Joi.string().trim().pattern(patterns.phone).optional()
      .messages({
        'string.pattern.base': 'Please provide a valid phone number'
      }),
    address: Joi.object({
      street: Joi.string().trim().max(255).optional(),
      city: Joi.string().trim().max(100).optional(),
      state: Joi.string().trim().max(100).optional(),
      zipCode: Joi.string().trim().max(20).optional(),
      country: Joi.string().trim().max(100).optional()
    }).optional(),
    parentId: Joi.string().optional(),
    mustChangePassword: Joi.boolean().default(false)
  }),

  // User login
  login: Joi.object({
    email: Joi.string().email().required().lowercase().trim(),
    password: Joi.string().required()
  }),

  // Update user profile
  updateProfile: Joi.object({
    name: Joi.string().min(2).max(100).trim().optional(),
    phone: Joi.string().trim().pattern(patterns.phone).optional()
      .messages({
        'string.pattern.base': 'Please provide a valid phone number'
      }),
    address: Joi.object({
      street: Joi.string().trim().max(255).optional(),
      city: Joi.string().trim().max(100).optional(),
      state: Joi.string().trim().max(100).optional(),
      zipCode: Joi.string().trim().max(20).optional(),
      country: Joi.string().trim().max(100).optional()
    }).optional()
  }),

  // Change password
  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).pattern(patterns.strongPassword).required()
      .messages({
        'string.pattern.base': 'Password must be at least 8 characters with uppercase, lowercase, number and special character'
      }),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
      .messages({
        'any.only': 'Confirm password must match new password'
      })
  }),

  // Assign subordinate
  assignSubordinate: Joi.object({
    subordinateId: Joi.string().required(),
    role: Joi.string().valid('ACCOUNTANT', 'CLIENT').required()
  })
};

// Client validation schemas
const clientValidation = {
  // Create client profile
  create: Joi.object({
    userId: Joi.string().required(),
    contactPerson: Joi.object({
      name: Joi.string().required().min(2).max(100).trim(),
      designation: Joi.string().trim().max(100).optional(),
      email: Joi.string().email().trim().optional(),
      phone: Joi.string().trim().pattern(patterns.phone).optional()
        .messages({
          'string.pattern.base': 'Please provide a valid phone number'
        })
    }).required(),
    companyDetails: Joi.object({
      registrationNumber: Joi.string().trim().max(100).optional(),
      incorporationDate: Joi.date().optional(),
      companyType: Joi.string().valid('PROPRIETORSHIP', 'PVT_LTD', 'PARTNERSHIP', 'LLP', 'PUBLIC_LTD', 'OTHER').optional(),
      industryType: Joi.string().trim().max(100).optional(),
      financialYearStart: Joi.string().valid('APRIL', 'JANUARY').default('APRIL')
    }).optional(),
    complianceDetails: Joi.object({
      gstRegistered: Joi.boolean().default(false),
      panNumber: Joi.string().trim().uppercase().pattern(patterns.panNumber).optional()
        .messages({
          'string.pattern.base': 'Please provide a valid PAN number'
        }),
      tanNumber: Joi.string().trim().max(20).optional(),
      cinNumber: Joi.string().trim().max(30).optional()
    }).optional(),
    assignedTo: Joi.string().optional(),
    notes: Joi.string().trim().max(1000).optional()
  }),

  // Update client profile
  update: Joi.object({
    contactPerson: Joi.object({
      name: Joi.string().min(2).max(100).trim().optional(),
      designation: Joi.string().trim().max(100).optional(),
      email: Joi.string().email().trim().optional(),
      phone: Joi.string().trim().pattern(patterns.phone).optional()
        .messages({
          'string.pattern.base': 'Please provide a valid phone number'
        })
    }).optional(),
    companyDetails: Joi.object({
      registrationNumber: Joi.string().trim().max(100).optional(),
      incorporationDate: Joi.date().optional(),
      companyType: Joi.string().valid('PROPRIETORSHIP', 'PVT_LTD', 'PARTNERSHIP', 'LLP', 'PUBLIC_LTD', 'OTHER').optional(),
      industryType: Joi.string().trim().max(100).optional(),
      financialYearStart: Joi.string().valid('APRIL', 'JANUARY').optional()
    }).optional(),
    complianceDetails: Joi.object({
      gstRegistered: Joi.boolean().optional(),
      panNumber: Joi.string().trim().uppercase().pattern(patterns.panNumber).optional()
        .messages({
          'string.pattern.base': 'Please provide a valid PAN number'
        }),
      tanNumber: Joi.string().trim().max(20).optional(),
      cinNumber: Joi.string().trim().max(30).optional()
    }).optional(),
    assignedTo: Joi.string().optional(),
    status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ON_HOLD').optional(),
    notes: Joi.string().trim().max(1000).optional()
  }),

  // Assign client
  assign: Joi.object({
    clientId: Joi.string().required(),
    assignedTo: Joi.string().required(),
    notes: Joi.string().trim().max(1000).optional()
  })
};

// Business validation schemas
const businessValidation = {
  // Create business
  create: Joi.object({
    clientId: Joi.string().required(),
    businessName: Joi.string().required().min(2).max(200).trim(),
    businessType: Joi.string().valid('PROPRIETORSHIP', 'PVT_LTD', 'PARTNERSHIP', 'LLP', 'PUBLIC_LTD', 'SINGLE_PERSON_COMPANY', 'OTHER').required(),
    registrationDetails: Joi.object({
      registrationNumber: Joi.string().trim().max(100).optional(),
      incorporationDate: Joi.date().optional(),
      registrationAuthority: Joi.string().trim().max(200).optional()
    }).optional(),
    taxDetails: Joi.object({
      panNumber: Joi.string().trim().uppercase().pattern(patterns.panNumber).optional()
        .messages({
          'string.pattern.base': 'Please provide a valid PAN number'
        }),
      tanNumber: Joi.string().trim().max(20).optional(),
      gstNumber: Joi.string().trim().pattern(patterns.gstNumber).optional()
        .messages({
          'string.pattern.base': 'Please provide a valid GST number'
        }),
      cinNumber: Joi.string().trim().max(30).optional()
    }).optional(),
    address: Joi.object({
      registered: Joi.object({
        street: Joi.string().trim().max(255).optional(),
        city: Joi.string().trim().max(100).optional(),
        state: Joi.string().trim().max(100).optional(),
        zipCode: Joi.string().trim().max(20).optional(),
        country: Joi.string().trim().max(100).optional()
      }).optional(),
      operational: Joi.object({
        street: Joi.string().trim().max(255).optional(),
        city: Joi.string().trim().max(100).optional(),
        state: Joi.string().trim().max(100).optional(),
        zipCode: Joi.string().trim().max(20).optional(),
        country: Joi.string().trim().max(100).optional()
      }).optional()
    }).optional(),
    bankDetails: Joi.array().items(Joi.object({
      bankName: Joi.string().trim().max(100).required(),
      accountNumber: Joi.string().trim().max(50).required(),
      ifscCode: Joi.string().trim().max(20).required(),
      branchName: Joi.string().trim().max(100).optional(),
      accountType: Joi.string().valid('SAVINGS', 'CURRENT', 'OVERDRAFT', 'OTHER').required(),
      isPrimary: Joi.boolean().default(false)
    })).optional(),
    assignedTo: Joi.string().optional(),
    status: Joi.string().valid('ACTIVE', 'INACTIVE', 'DORMANT', 'CLOSED').default('ACTIVE'),
    notes: Joi.string().trim().max(2000).optional(),
    tags: Joi.array().items(Joi.string().trim().max(50)).max(10).optional()
  }),

  // Update business
  update: Joi.object({
    businessName: Joi.string().min(2).max(200).trim().optional(),
    businessType: Joi.string().valid('PROPRIETORSHIP', 'PVT_LTD', 'PARTNERSHIP', 'LLP', 'PUBLIC_LTD', 'SINGLE_PERSON_COMPANY', 'OTHER').optional(),
    registrationDetails: Joi.object({
      registrationNumber: Joi.string().trim().max(100).optional(),
      incorporationDate: Joi.date().optional(),
      registrationAuthority: Joi.string().trim().max(200).optional()
    }).optional(),
    taxDetails: Joi.object({
      panNumber: Joi.string().trim().uppercase().pattern(patterns.panNumber).optional()
        .messages({
          'string.pattern.base': 'Please provide a valid PAN number'
        }),
      tanNumber: Joi.string().trim().max(20).optional(),
      gstNumber: Joi.string().trim().pattern(patterns.gstNumber).optional()
        .messages({
          'string.pattern.base': 'Please provide a valid GST number'
        }),
      cinNumber: Joi.string().trim().max(30).optional()
    }).optional(),
    assignedTo: Joi.string().optional(),
    status: Joi.string().valid('ACTIVE', 'INACTIVE', 'DORMANT', 'CLOSED').optional(),
    complianceStatus: Joi.object({
      gstReturn: Joi.object({
        status: Joi.string().valid('FILED', 'PENDING', 'OVERDUE', 'EXEMPTED').optional(),
        nextDue: Joi.date().optional()
      }).optional(),
      incomeTax: Joi.object({
        status: Joi.string().valid('FILED', 'PENDING', 'OVERDUE', 'EXEMPTED').optional(),
        nextDue: Joi.date().optional()
      }).optional(),
      annualReturn: Joi.object({
        status: Joi.string().valid('FILED', 'PENDING', 'OVERDUE', 'EXEMPTED').optional(),
        nextDue: Joi.date().optional()
      }).optional()
    }).optional(),
    notes: Joi.string().trim().max(2000).optional(),
    tags: Joi.array().items(Joi.string().trim().max(50)).max(10).optional()
  })
};

// Assignment validation schemas
const assignmentValidation = {
  assign: Joi.object({
    assigneeId: Joi.string().required(),
    assignmentType: Joi.string().valid('USER_TO_USER', 'CLIENT_TO_ACCOUNTANT', 'BUSINESS_TO_ACCOUNTANT').required(),
    entityType: Joi.string().valid('USER', 'CLIENT', 'BUSINESS').optional(),
    entityId: Joi.string().optional(),
    notes: Joi.string().trim().max(1000).optional()
  })
};

// MongoDB ObjectId validation
const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/)
  .message('Invalid ID format');

module.exports = {
  validate,
  userValidation,
  clientValidation,
  businessValidation,
  assignmentValidation,
  objectId
};