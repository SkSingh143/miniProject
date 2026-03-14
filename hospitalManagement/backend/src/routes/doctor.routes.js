const express = require('express');
const {
  getDoctorAppointments,
  updateAvailability,
  createPrescription,
  getPatientDetails,
  updateAppointmentStatus,
  getDoctorProfile
} = require('../controllers/doctor.controller');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const router = express.Router();

// Only doctors can access these routes
router.use(protect);
router.use(authorize('doctor'));

router.get('/appointments', getDoctorAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);  // Update status (confirm/complete/cancel)
router.put('/availability', updateAvailability);
router.get('/profile', getDoctorProfile);
router.get('/patient/:id', getPatientDetails);
router.post('/prescriptions', createPrescription);  // Create prescription

module.exports = router;
