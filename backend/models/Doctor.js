const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema({
  doctorId: {
    type: String,
    unique: true,
    // required: true
  },
  doctorName: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Please provide your age'],
    min: 25,
    max: 80
  },
  gender: {
    type: String,
    required: [true, 'Please select your gender'],
    enum: ['Male', 'Female', 'Other']
  },
  specialization: {
    type: String,
    required: [true, 'Please provide your specialization'],
    trim: true
  },
  medicalRegistrationNumber: {
    type: String,
    required: [true, 'Please provide your medical registration number'],
    unique: true,
    trim: true
  },
  registrationState: {
    type: String,
    required: [true, 'Please provide your registration state'],
    trim: true
  },
  currentPracticeHospital: {
    type: String,
    required: [true, 'Please provide your current practice hospital'],
    trim: true
  },
  yearsOfExperience: {
    type: Number,
    required: [true, 'Please provide years of experience'],
    min: 0
  },
  totalPatientsTreated: {
    type: Number,
    required: [true, 'Please provide total patients treated'],
    min: 0
  },
  professionalPhoto: {
    type: String,
    required: [true, 'Please upload your professional photo']
  },
  registrationCertificate: {
    type: String,
    required: [true, 'Please upload your registration certificate']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  mobileNumber: {
    type: String,
    required: [true, 'Please provide your mobile number'],
    match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian mobile number']
  },
  approvalStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  approvalToken: String,
approvalTokenExpires: Date,
  password: {
    type: String,
    minlength: 8,
    select: false
  },
  isActive: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date
  },
  approvedBy: {
    type: String
  }
});

// Hash password before saving (only if approved and password is set)
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
doctorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate unique Doctor ID
doctorSchema.pre('save', async function(next) {
  if (!this.doctorId) {
    const count = await mongoose.model('Doctor').countDocuments();
    this.doctorId = 'DR' + String(count + 1).padStart(6, '0');
  }
  next();
});

module.exports = mongoose.model('Doctor', doctorSchema);
