const Doctor = require('../models/Doctor');
const { generateToken } = require('../utils/jwtUtils');
const { sendDoctorRegistrationEmail } = require('../services/emailService');
const { sendDoctorApprovedEmail } = require("../services/emailService");
const crypto = require("crypto");


// @desc    Register new doctor (pending approval)
// @route   POST /api/auth/doctor/signup
// @access  Public
exports.registerDoctor = async (req, res, next) => {
  try {
    const {
      doctorName,
      age,
      gender,
      specialization,
      medicalRegistrationNumber,
      registrationState,
      currentPracticeHospital,
      yearsOfExperience,
      totalPatientsTreated,
      email,
      mobileNumber
    } = req.body;

    // Validate file uploads
    if (!req.files || !req.files.professionalPhoto || !req.files.registrationCertificate) {
      return res.status(400).json({
        success: false,
        message: 'Please upload both professional photo and registration certificate'
      });
    }

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({
      $or: [{ email }, { medicalRegistrationNumber }]
    });

    if (existingDoctor) {
      if (existingDoctor.email === email) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }
      if (existingDoctor.medicalRegistrationNumber === medicalRegistrationNumber) {
        return res.status(400).json({
          success: false,
          message: 'Medical registration number already exists'
        });
      }
    }

    // Create doctor
    const doctor = await Doctor.create({
      doctorName,
      age,
      gender,
      specialization,
      medicalRegistrationNumber,
      registrationState,
      currentPracticeHospital,
      yearsOfExperience,
      totalPatientsTreated,
      email,
      mobileNumber,
      professionalPhoto: req.files.professionalPhoto[0].path,
      registrationCertificate: req.files.registrationCertificate[0].path,
      approvalStatus: 'Pending'
    });

    // 🔐 Generate approval token BEFORE sending email
    const approvalToken = crypto.randomBytes(32).toString("hex");

    doctor.approvalToken = approvalToken;
    doctor.approvalTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

    await doctor.save();

    // ✅ Send email with doctor object (which now has token)
    await sendDoctorRegistrationEmail(doctor);

    res.status(201).json({
      success: true,
      message: 'Doctor registration submitted successfully. Please wait for admin approval.',
      data: {
        doctorId: doctor.doctorId,
        doctorName: doctor.doctorName,
        email: doctor.email,
        approvalStatus: doctor.approvalStatus
      }
    });

  } catch (error) {
    next(error);
  }
};


// @desc    Login doctor (only if approved)
// @route   POST /api/auth/doctor/signin
// @access  Public
exports.loginDoctor = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if doctor exists
    const doctor = await Doctor.findOne({ email }).select('+password');

    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if doctor is approved
    if (doctor.approvalStatus !== 'Approved') {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval. Please wait for admin verification.',
        approvalStatus: doctor.approvalStatus
      });
    }

    // Check if password is set
    if (!doctor.password) {
      return res.status(400).json({
        success: false,
        message: 'Please set your password first. Check your email for instructions.'
      });
    }

    // Check if password matches
    const isPasswordMatch = await doctor.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(doctor._id, 'doctor');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        doctorId: doctor.doctorId,
        doctorName: doctor.doctorName,
        specialization: doctor.specialization,
        email: doctor.email,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor profile
// @route   GET /api/doctor/profile
// @access  Private (Doctor only)
exports.getDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        doctorId: doctor.doctorId,
        doctorName: doctor.doctorName,
        age: doctor.age,
        gender: doctor.gender,
        specialization: doctor.specialization,
        medicalRegistrationNumber: doctor.medicalRegistrationNumber,
        registrationState: doctor.registrationState,
        currentPracticeHospital: doctor.currentPracticeHospital,
        yearsOfExperience: doctor.yearsOfExperience,
        totalPatientsTreated: doctor.totalPatientsTreated,
        email: doctor.email,
        mobileNumber: doctor.mobileNumber,
        approvalStatus: doctor.approvalStatus,
        isActive: doctor.isActive,
        professionalPhoto: doctor.professionalPhoto,
        createdAt: doctor.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve doctor (Admin only - for future implementation)
// @route   PUT /api/admin/doctor/:id/approve
// @access  Private (Admin only)

exports.approveDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    // Prevent double approval
    if (doctor.approvalStatus === "Approved") {
      return res.status(400).json({
        success: false,
        message: "Doctor already approved"
      });
    }

    // 🔐 Generate secure temporary password (8 characters)
    const temporaryPassword = crypto.randomBytes(4).toString("hex");

    doctor.approvalStatus = "Approved";
    doctor.isActive = true;
    doctor.approvedAt = Date.now();
    doctor.password = temporaryPassword; // Will be hashed by pre-save hook

    await doctor.save();

    // 📩 Send approval email with temporary password
    await sendDoctorApprovedEmail({
      email: doctor.email,
      doctorName: doctor.doctorName,
      temporaryPassword
    });

    res.status(200).json({
      success: true,
      message: "Doctor approved successfully and email sent",
      data: {
        doctorId: doctor.doctorId,
        doctorName: doctor.doctorName,
        approvalStatus: doctor.approvalStatus
      }
    });

  } catch (error) {
    next(error);
  }
};


// @desc    Get all pending doctors (Admin only - for future implementation)
// @route   GET /api/admin/doctors/pending
// @access  Private (Admin only)
exports.getPendingDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({ approvalStatus: 'Pending' })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
