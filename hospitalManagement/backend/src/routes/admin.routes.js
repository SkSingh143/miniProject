const express = require('express');
const { createClinic } = require('../controllers/clinic.controller');
const { getAllClinics, updateClinicStatus, getSystemStats } = require('../controllers/superAdmin.controller');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const router = express.Router();

// Only Super Admin can access these routes
router.use(protect);
router.use(authorize('super_admin'));

router.post('/clinics', createClinic);
router.get('/clinics', getAllClinics);
router.put('/clinics/:id/status', updateClinicStatus);
router.get('/stats', getSystemStats);

module.exports = router;