const express = require('express');
const { bookAppointment, getSlots } = require('../controllers/appointment.controller');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/slots', getSlots); // Public or Protected depending on requirements

router.use(protect); // Routes below this require login
router.post('/book', bookAppointment);

module.exports = router;