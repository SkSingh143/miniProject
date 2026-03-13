const express = require('express');
const { addDoctor } = require('../controllers/clinic.controller');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const router = express.Router();

// Only Clinic Admin can access these routes
router.use(protect);
router.use(authorize('clinic_admin'));

router.post('/doctors', addDoctor);

module.exports = router;