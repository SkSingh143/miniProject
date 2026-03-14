const express = require('express');
const {
  getActiveClinics,
  getClinicDoctors,
  getPatientAppointments,
  cancelAppointment,
  getPatientPrescriptions,
  getPrescriptionById
} = require('../controllers/patient.controller');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const router = express.Router();

// Public routes (no auth needed to browse clinics/doctors)
router.get('/clinics', getActiveClinics);
router.get('/clinics/:clinicId/doctors', getClinicDoctors);

// Protected patient routes
router.use(protect);
router.use(authorize('patient'));

router.get('/appointments', getPatientAppointments);
router.put('/appointments/:id/cancel', cancelAppointment);
router.get('/prescriptions', getPatientPrescriptions);
router.get('/prescriptions/:id', getPrescriptionById);

module.exports = router;
