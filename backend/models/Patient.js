const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const CryptoJS = require('crypto-js');

const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    unique: true,
    // required: true
  },
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Please provide your age'],
    min: 0,
    max: 150
  },
  gender: {
    type: String,
    required: [true, 'Please select your gender'],
    enum: ['Male', 'Female', 'Other']
  },
  mobileNumber: {
    type: String,
    required: [true, 'Please provide your mobile number'],
    unique: true,
    match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian mobile number']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  address: {
    type: String,
    required: [true, 'Please provide your address']
  },
  emergencyContact: {
    type: String,
    required: [true, 'Please provide emergency contact number'],
    match: [/^[6-9]\d{9}$/, 'Please provide a valid emergency contact number']
  },
  aadhaarNumber: {
    type: String,
    required: [true, 'Please provide your Aadhaar number'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  medicalRecords: [{
    date: {
      type: Date,
      default: Date.now
    },
    symptoms: String,
    diagnosis: String,
    prescription: String,
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    followUpStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Scheduled'],
      default: 'Pending'
    },
    followUpDate: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt Aadhaar before saving
patientSchema.pre('save', function(next) {
  if (this.isModified('aadhaarNumber')) {
    this.aadhaarNumber = CryptoJS.AES.encrypt(
      this.aadhaarNumber, 
      process.env.ENCRYPTION_KEY
    ).toString();
  }
  next();
});

// Hash password before saving
patientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to decrypt Aadhaar
patientSchema.methods.getDecryptedAadhaar = function() {
  const bytes = CryptoJS.AES.decrypt(this.aadhaarNumber, process.env.ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Method to mask Aadhaar (show only last 4 digits)
patientSchema.methods.getMaskedAadhaar = function() {
  const decrypted = this.getDecryptedAadhaar();
  return 'XXXX-XXXX-' + decrypted.slice(-4);
};

// Method to compare passwords
patientSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate unique Patient ID
patientSchema.pre('save', async function(next) {
  if (!this.patientId) {
    const count = await mongoose.model('Patient').countDocuments();
    this.patientId = 'PT' + String(count + 1).padStart(6, '0');
  }
  next();
});

module.exports = mongoose.model('Patient', patientSchema);
