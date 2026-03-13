const express = require('express');
const { createClinic } = require('../controllers/clinic.controller');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const router = express.Router();

// Only Super Admin can access these routes
router.use(protect);
router.use(authorize('super_admin'));

router.post('/clinics', createClinic);

module.exports = router;