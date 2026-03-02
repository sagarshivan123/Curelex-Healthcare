const Patient = require('../models/Patient');
const { generateToken } = require('../utils/jwtUtils');
const { sendPatientRegistrationEmail } = require('../services/emailService');

exports.registerPatient = async (req, res, next) => {
  try {
    const {
      fullName,
      age,
      gender,
      mobileNumber,
      email,
      address,
      emergencyContact,
      aadhaarNumber,
      password,
      confirmPassword
    } = req.body;

    // Validate passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Check if patient already exists
    const existingPatient = await Patient.findOne({
      $or: [{ email }, { mobileNumber }, { aadhaarNumber }]
    });

    if (existingPatient) {
      if (existingPatient.email === email) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }
      if (existingPatient.mobileNumber === mobileNumber) {
        return res.status(400).json({
          success: false,
          message: 'Mobile number already registered'
        });
      }
      if (existingPatient.getDecryptedAadhaar() === aadhaarNumber) {
        return res.status(400).json({
          success: false,
          message: 'Aadhaar number already registered'
        });
      }
    }

    // Create patient
    const patient = await Patient.create({
      fullName,
      age,
      gender,
      mobileNumber,
      email,
      address,
      emergencyContact,
      aadhaarNumber,
      password
    });

    // Send registration email to company
    const emailData = {
      patientId: patient.patientId,
      fullName: patient.fullName,
      age: patient.age,
      gender: patient.gender,
      mobileNumber: patient.mobileNumber,
      email: patient.email,
      address: patient.address,
      emergencyContact: patient.emergencyContact,
      maskedAadhaar: patient.getMaskedAadhaar(),
      createdAt: patient.createdAt
    };

    await sendPatientRegistrationEmail(emailData);

    // Generate token
    const token = generateToken(patient._id, 'patient');

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: {
        patientId: patient.patientId,
        fullName: patient.fullName,
        email: patient.email,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.loginPatient = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if patient exists
    const patient = await Patient.findOne({ email }).select('+password');

    if (!patient) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isPasswordMatch = await patient.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(patient._id, 'patient');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        patientId: patient.patientId,
        fullName: patient.fullName,
        email: patient.email,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getPatientDashboard = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.user._id)
      .populate('medicalRecords.doctorId', 'doctorName specialization');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Get current symptoms (most recent medical record)
    const currentSymptoms = patient.medicalRecords.length > 0
      ? patient.medicalRecords[patient.medicalRecords.length - 1].symptoms
      : null;

    // Get past prescriptions
    const pastPrescriptions = patient.medicalRecords
      .filter(record => record.prescription)
      .map(record => ({
        date: record.date,
        prescription: record.prescription,
        diagnosis: record.diagnosis,
        doctor: record.doctorId ? {
          name: record.doctorId.doctorName,
          specialization: record.doctorId.specialization
        } : null
      }));

    // Get past follow-ups
    const pastFollowUps = patient.medicalRecords
      .filter(record => record.followUpStatus === 'Completed')
      .map(record => ({
        date: record.date,
        diagnosis: record.diagnosis,
        followUpDate: record.followUpDate,
        doctor: record.doctorId ? {
          name: record.doctorId.doctorName,
          specialization: record.doctorId.specialization
        } : null
      }));

    // Get current follow-up status
    const currentFollowUp = patient.medicalRecords
      .filter(record => ['Pending', 'Scheduled'].includes(record.followUpStatus))
      .map(record => ({
        date: record.date,
        diagnosis: record.diagnosis,
        followUpStatus: record.followUpStatus,
        followUpDate: record.followUpDate,
        doctor: record.doctorId ? {
          name: record.doctorId.doctorName,
          specialization: record.doctorId.specialization
        } : null
      }));

    res.status(200).json({
      success: true,
      data: {
        patient: {
          patientId: patient.patientId,
          fullName: patient.fullName,
          age: patient.age,
          gender: patient.gender,
          email: patient.email,
          mobileNumber: patient.mobileNumber
        },
        currentSymptoms,
        pastPrescriptions,
        pastFollowUps,
        currentFollowUp
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient profile
// @route   GET /api/patient/profile
// @access  Private (Patient only)
exports.getPatientProfile = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        patientId: patient.patientId,
        fullName: patient.fullName,
        age: patient.age,
        gender: patient.gender,
        mobileNumber: patient.mobileNumber,
        email: patient.email,
        address: patient.address,
        emergencyContact: patient.emergencyContact,
        maskedAadhaar: patient.getMaskedAadhaar(),
        createdAt: patient.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/patient/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const patient = await Patient.findOne({ email });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email'
      });
    }

    // In a real application, you would:
    // 1. Generate a reset token
    // 2. Save it to database with expiry
    // 3. Send email with reset link
    // For now, we'll just send a success response

    res.status(200).json({
      success: true,
      message: 'Password reset instructions sent to your email'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
