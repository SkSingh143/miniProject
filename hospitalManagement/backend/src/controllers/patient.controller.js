const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const Clinic = require('../models/Clinic');
const User = require('../models/User');
const apiResponse = require('../utils/apiResponse');

// @desc    Get all active clinics (public - for patients to browse)
// @route   GET /api/patient/clinics
exports.getActiveClinics = async (req, res, next) => {
  try {
    const clinics = await Clinic.find({ isActive: true }).sort({ name: 1 });
    apiResponse(res, 200, 'Clinics fetched', clinics);
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctors belonging to a specific clinic with their availability
// @route   GET /api/patient/clinics/:clinicId/doctors
exports.getClinicDoctors = async (req, res, next) => {
  try {
    const { clinicId } = req.params;
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) return apiResponse(res, 404, 'Clinic not found');

    // DoctorProfile uses 'user' field (not 'doctor') for the User reference
    const DoctorProfile = require('../models/DoctorProfile');
    const profiles = await DoctorProfile.find({ clinic: clinicId })
      .populate('user', 'name email');

    apiResponse(res, 200, 'Doctors fetched', profiles);
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient's appointment history with status
// @route   GET /api/patient/appointments
exports.getPatientAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'name email')
      .populate('clinic', 'name address')
      .sort({ date: -1 });

    apiResponse(res, 200, 'Appointments fetched', appointments);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an appointment
// @route   PUT /api/patient/appointments/:id/cancel
exports.cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user._id
    });

    if (!appointment) return apiResponse(res, 404, 'Appointment not found');
    if (appointment.status === 'cancelled') return apiResponse(res, 400, 'Appointment already cancelled');
    if (appointment.status === 'completed') return apiResponse(res, 400, 'Cannot cancel a completed appointment');

    appointment.status = 'cancelled';
    await appointment.save();

    apiResponse(res, 200, 'Appointment cancelled successfully', appointment);
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient's prescription history
// @route   GET /api/patient/prescriptions
exports.getPatientPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user._id })
      .populate('doctor', 'name')
      .populate('clinic', 'name address')
      .populate('appointment', 'date timeSlot')
      .sort({ createdAt: -1 });

    apiResponse(res, 200, 'Prescriptions fetched', prescriptions);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single prescription by ID (for PDF download)
// @route   GET /api/patient/prescriptions/:id
exports.getPrescriptionById = async (req, res, next) => {
  try {
    const prescription = await Prescription.findOne({
      _id: req.params.id,
      patient: req.user._id
    })
      .populate('doctor', 'name email')
      .populate('clinic', 'name address contactInfo')
      .populate('appointment', 'date timeSlot');

    if (!prescription) return apiResponse(res, 404, 'Prescription not found');

    apiResponse(res, 200, 'Prescription fetched', prescription);
  } catch (error) {
    next(error);
  }
};
