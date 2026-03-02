const express = require('express');
const router = express.Router();
const {
  registerPatient,
  loginPatient,
  getPatientDashboard,
  getPatientProfile,
  forgotPassword
} = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/auth/patient/signup', registerPatient);
router.post('/auth/patient/signin', loginPatient);
router.post('/auth/patient/forgot-password', forgotPassword);

// Protected routes (Patient only)
router.get('/patient/dashboard', protect, authorize('patient'), getPatientDashboard);
router.get('/patient/profile', protect, authorize('patient'), getPatientProfile);

module.exports = router;
