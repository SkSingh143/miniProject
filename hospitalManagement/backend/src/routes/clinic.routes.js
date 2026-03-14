const express = require('express');
const {
  addDoctor,
  getClinicProfile,
  updateClinicProfile,
  getClinicDoctors,
  updateDoctorAvailability,
  getClinicAppointments,
  updateClinicAppointment,
  getPatientClinicHistory,
  getClinicPatients
} = require('../controllers/clinic.controller');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const router = express.Router();

// All routes require clinic_admin role
router.use(protect);
router.use(authorize('clinic_admin'));

// Clinic Profile
router.get('/profile', getClinicProfile);
router.put('/profile', updateClinicProfile);

// Doctor Management
router.get('/doctors', getClinicDoctors);
router.post('/doctors', addDoctor);
router.put('/doctors/:doctorProfileId/availability', updateDoctorAvailability);

// Appointment Management
router.get('/appointments', getClinicAppointments);
router.put('/appointments/:id', updateClinicAppointment);

// Patient History
router.get('/patients', getClinicPatients);
router.get('/patients/:patientId/history', getPatientClinicHistory);

module.exports = router;