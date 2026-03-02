const express = require('express');
const router = express.Router();
const {
  registerDoctor,
  loginDoctor,
  getDoctorProfile,
  approveDoctor,
  getPendingDoctors
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/fileUpload');

// Public routes
router.post(
  '/auth/doctor/signup',
  upload.fields([
    { name: 'professionalPhoto', maxCount: 1 },
    { name: 'registrationCertificate', maxCount: 1 }
  ]),
  registerDoctor
);
router.post('/auth/doctor/signin', loginDoctor);

// Protected routes (Doctor only)
router.get('/doctor/profile', protect, authorize('doctor'), getDoctorProfile);

// Admin routes (for future implementation)
router.get('/admin/doctors/pending', getPendingDoctors);
router.put('/admin/doctor/:id/approve', approveDoctor);

module.exports = router;
