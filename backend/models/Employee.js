const mongoose = require('mongoose');

const INTERNATIONAL_PHONE_REGEX = /^\+\d{7,15}$/;
const phoneValidator = {
  validator: (value) => !value || INTERNATIONAL_PHONE_REGEX.test(value),
  message: 'Phone number must include country code (e.g. +971501234567)'
};

// Document subdocument schema
const documentSchema = new mongoose.Schema({
  name: String,
  url: String,
  size: Number,
  type: String,
  uploadDate: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const employeeSchema = new mongoose.Schema({
  // Basic Information
  employeeCode: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  mobileNo: {
    type: String,
    trim: true,
    validate: phoneValidator
  },
  dateOfBirth: String,
  dateOfJoining: String,
  
  // Company Information
  department: {
    type: String
  },
  company: {
    type: String,
    enum: ['RFE', 'Royal Tree', 'Royal Falcon']
  },
  employeeStatus: {
    type: String,
    enum: ['Tourist', 'Resident']
  },
  role: {
    type: String
  },
  
  // Personal Details
  gender: String,
  nationality: String,
  maritalStatus: String,
  bloodGroup: String,
  alternateEmail: String,
  currentAddress: String,
  permanentAddress: String,
  
  // Employment Details
  jobTitle: String,
  workLocation: String,
  reportingManager: String,
  referencePerson: String,
  employmentType: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Contract', 'Intern']
  },
  
  // Passport Details
  passportNumber: String,
  passportIssueDate: String,
  passportIssuePlace: String,
  passportExpiryDate: String,
  
  // Visa ID Details (for Residents)
  visaIdNumber: String,
  visaType: String,
  visaIssueDate: String,
  visaExpiryDate: String,
  countryOfVisaIssuance: String,
  
  // Emirates ID (for Residents) - Removed as not in frontend
  // emiratesIdNumber: String,
  // emiratesIdIssueDate: String,
  // emiratesIdExpiryDate: String,
  // residentIdExpiryDate: String,
  
  // Other Documents
  drivingLicenseNumber: String,
  drivingLicenseExpiry: String,
  
  // Emergency Contact
  fatherName: String,
  emergencyMobileNumber: {
    type: String,
    trim: true,
    validate: phoneValidator
  },
  emergencyRelationship: String,
  alternateEmergencyContact: {
    type: String,
    trim: true,
    validate: phoneValidator
  },
  alternateRelationship: String,
  
  // Salary
  salary: {
    type: Number
  },
  
  // Bank Details
  bankName: String,
  accountHolderName: String,
  accountNumber: String,
  ibanNumber: String,
  ifscCode: String,
  swiftCode: String,
  accountType: {
    type: String,
    enum: ['Savings', 'Current', 'Salary']
  },
  bankBranchAddress: String,
  
  // IT & Access
  officeEmail: String,
  systemUsername: String,
  deviceSerialNumber: String,
  
  // Additional
  notes: String,
  documents: [documentSchema],
  
  // Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on update
employeeSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Employee', employeeSchema);
