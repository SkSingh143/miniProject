const Appointment = require('../models/Appointment');
const DoctorProfile = require('../models/DoctorProfile');
const Prescription = require('../models/Prescription');
const User = require('../models/User');
const apiResponse = require('../utils/apiResponse');

// @desc    View assigned appointments for a specific day
// @route   GET /api/doctor/appointments
exports.getDoctorAppointments = async (req, res, next) => {
  try {
    const { date } = req.query;
    const doctorId = req.user._id;

    if (!date) {
      return apiResponse(res, 400, 'Date parameter is required (YYYY-MM-DD)');
    }

    const appointments = await Appointment.find({
      doctor: doctorId,
      date: new Date(date)
    })
      .populate('patient', 'name email phone') // Fetch basic patient details
      .sort({ timeSlot: 1 });

    apiResponse(res, 200, 'Appointments fetched successfully', appointments);
  } catch (error) {
    next(error);
  }
};

// @desc    Manage available time slots
// @route   PUT /api/doctor/availability
exports.updateAvailability = async (req, res, next) => {
  try {
    const { slots } = req.body; // Array of { day, startTime, endTime }
    const doctorId = req.user._id;

    const profile = await DoctorProfile.findOneAndUpdate(
      { user: doctorId },
      { availability: slots },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return apiResponse(res, 404, 'Doctor profile not found');
    }

    apiResponse(res, 200, 'Availability updated successfully', profile);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a digital prescription
// @route   POST /api/prescriptions
exports.createPrescription = async (req, res, next) => {
  try {
    const { appointmentId, patientId, diagnosis, medicines, notes } = req.body;
    const doctorId = req.user._id;
    const clinicId = req.user.clinicId;

    // 1. Create the prescription
    const prescription = await Prescription.create({
      appointment: appointmentId,
      patient: patientId,
      doctor: doctorId,
      clinic: clinicId,
      diagnosis,
      medicines,
      notes
    });

    // 2. Update the appointment status to 'completed'
    await Appointment.findByIdAndUpdate(appointmentId, { status: 'completed' });

    apiResponse(res, 201, 'Prescription created successfully', prescription);
  } catch (error) {
    next(error);
  }
};

// @desc    View basic details of a specific patient
// @route   GET /api/doctor/patient/:id
exports.getPatientDetails = async (req, res, next) => {
  try {
    const patientId = req.params.id;

    // Fetch user details
    const patient = await User.findById(patientId).select('-password -role');
    
    if (!patient) {
      return apiResponse(res, 404, 'Patient not found');
    }

    // Optional: Fetch previous prescriptions by THIS doctor for THIS patient
    const pastPrescriptions = await Prescription.find({
      patient: patientId,
      doctor: req.user._id
    }).sort({ createdAt: -1 });

    apiResponse(res, 200, 'Patient details fetched', { patient, pastPrescriptions });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status (confirm / complete / cancel)
// @route   PUT /api/doctor/appointments/:id/status
exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['confirmed', 'completed', 'cancelled'];

    if (!allowedStatuses.includes(status)) {
      return apiResponse(res, 400, `Status must be one of: ${allowedStatuses.join(', ')}`);
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: req.user._id
    });

    if (!appointment) return apiResponse(res, 404, 'Appointment not found or not assigned to you');

    appointment.status = status;
    await appointment.save();

    apiResponse(res, 200, `Appointment marked as ${status}`, appointment);
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor's own profile + clinic info
// @route   GET /api/doctor/profile
exports.getDoctorProfile = async (req, res, next) => {
  try {
    const profile = await DoctorProfile.findOne({ user: req.user._id })
      .populate('user', 'name email')
      .populate('clinic', 'name address contactInfo workingHours');

    if (!profile) return apiResponse(res, 404, 'Doctor profile not found');

    apiResponse(res, 200, 'Profile fetched', profile);
  } catch (error) {
    next(error);
  }
};