const Appointment = require('../models/Appointment');
const apiResponse = require('../utils/apiResponse');
const { sendEmail } = require('../services/emailService');

// @desc    Book an appointment
// @route   POST /api/appointments/book
exports.bookAppointment = async (req, res, next) => {
  try {
    const { clinicId, doctorId, date, timeSlot } = req.body;
    const patientId = req.user._id;

    // 1. Double Booking Check 
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: date,
      timeSlot: timeSlot,
      status: { $ne: 'cancelled' } // Ignore cancelled slots
    });

    if (existingAppointment) {
      return apiResponse(res, 409, 'Slot already booked');
    }

    // 2. Create Appointment
    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      clinic: clinicId,
      date,
      timeSlot
    });

    // 3. Send Email Notification
    await sendEmail(req.user.email, 'Appointment Confirmed', `Your appointment is on ${date} at ${timeSlot}`);

    apiResponse(res, 201, 'Appointment booked successfully', appointment);
  } catch (error) {
    next(error);
  }
};

// @desc    Get available slots
// @route   GET /api/appointments/slots
exports.getSlots = async (req, res, next) => {
  try {
    const { doctorId, date } = req.query;

    // Get all booked slots for this doctor on this date
    const appointments = await Appointment.find({
      doctor: doctorId,
      date: date,
      status: { $ne: 'cancelled' }
    }).select('timeSlot');

    const bookedSlots = appointments.map(app => app.timeSlot);

    // In a real app, fetch doctor's availability from DoctorProfile and filter out bookedSlots
    apiResponse(res, 200, 'Booked slots fetched', bookedSlots);
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointment history for logged-in patient
// @route   GET /api/appointments/history
exports.getAppointmentHistory = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { patient: req.user._id };
    if (status && status !== 'upcoming') query.status = status;
    if (status === 'upcoming') query.status = { $in: ['pending', 'confirmed'] };

    const appointments = await Appointment.find(query)
      .populate('doctor', 'name email')
      .populate('clinic', 'name address')
      .sort({ date: -1 });

    apiResponse(res, 200, 'Appointment history fetched', appointments);
  } catch (error) {
    next(error);
  }
};