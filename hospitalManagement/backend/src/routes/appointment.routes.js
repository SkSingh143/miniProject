const express = require('express');
const { bookAppointment, getSlots, getAppointmentHistory } = require('../controllers/appointment.controller');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/slots', getSlots); // Public - get available slots

router.use(protect); // Routes below require login
router.post('/book', bookAppointment);
router.get('/history', getAppointmentHistory); // Patient appointment history

module.exports = router;