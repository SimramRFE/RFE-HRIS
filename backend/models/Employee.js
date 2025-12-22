const mongoose = require('mongoose');

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
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
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
    required: true
  },
  dateOfBirth: String,
  dateOfJoining: {
    type: String,
    required: true
  },
  
  // Company Information
  department: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true,
    enum: ['RFE', 'Royal Tree', 'Royal Falcon']
  },
  employeeStatus: {
    type: String,
    required: true,
    enum: ['Tourist', 'Resident']
  },
  role: {
    type: String,
    required: true
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
  emergencyMobileNumber: String,
  emergencyRelationship: String,
  alternateEmergencyContact: String,
  alternateRelationship: String,
  
  // Salary
  salary: {
    type: Number,
    required: true
  },
  
  // Bank Details
  bankName: String,
  accountHolderName: String,
  accountNumber: String,
  ifscCode: String,
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
