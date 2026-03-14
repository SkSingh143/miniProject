const Clinic = require('../models/Clinic');
const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const apiResponse = require('../utils/apiResponse');

// @desc    Register a new clinic (Super Admin)
// @route   POST /api/admin/clinics
exports.createClinic = async (req, res, next) => {
  try {
    const { name, address, licenseNo, adminEmail, adminPassword } = req.body;

    // 1. Create the Clinic
    const clinic = await Clinic.create({
      name, address, licenseNo, adminEmail
    });

    // 2. Create the Clinic Admin User
    const clinicAdmin = await User.create({
      name: `${name} Admin`,
      email: adminEmail,
      password: adminPassword,
      role: 'clinic_admin',
      clinicId: clinic._id
    });

    apiResponse(res, 201, 'Clinic and Admin created', { clinic, clinicAdmin });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a doctor to a clinic
// @route   POST /api/clinic/doctors
exports.addDoctor = async (req, res, next) => {
  try {
    const { name, email, password, specialization, experience, availability } = req.body;
    const clinicId = req.user.clinicId; // From authMiddleware

    // 1. Create User account for Doctor
    const doctorUser = await User.create({
      name, email, password, role: 'doctor', clinicId
    });

    // 2. Create Doctor Profile
    const doctorProfile = await DoctorProfile.create({
      user: doctorUser._id,
      clinic: clinicId,
      specialization,
      experience,
      availability
    });

    apiResponse(res, 201, 'Doctor added successfully', doctorProfile);
  } catch (error) {
    next(error);
  }
};

// @desc    Get clinic's own profile
// @route   GET /api/clinic/profile
exports.getClinicProfile = async (req, res, next) => {
  try {
    const clinic = await Clinic.findById(req.user.clinicId);
    if (!clinic) return apiResponse(res, 404, 'Clinic not found');
    apiResponse(res, 200, 'Clinic profile fetched', clinic);
  } catch (error) {
    next(error);
  }
};

// @desc    Update clinic profile (name, address, contactInfo, workingHours)
// @route   PUT /api/clinic/profile
exports.updateClinicProfile = async (req, res, next) => {
  try {
    const { name, address, contactInfo, workingHours } = req.body;
    const clinic = await Clinic.findByIdAndUpdate(
      req.user.clinicId,
      { name, address, contactInfo, workingHours },
      { new: true, runValidators: true }
    );
    if (!clinic) return apiResponse(res, 404, 'Clinic not found');
    apiResponse(res, 200, 'Clinic profile updated', clinic);
  } catch (error) {
    next(error);
  }
};

// @desc    List all doctors in this clinic (with their profiles)
// @route   GET /api/clinic/doctors
exports.getClinicDoctors = async (req, res, next) => {
  try {
    const profiles = await DoctorProfile.find({ clinic: req.user.clinicId })
      .populate('user', 'name email');
    apiResponse(res, 200, 'Doctors fetched', profiles);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a doctor's availability (clinic admin sets schedule)
// @route   PUT /api/clinic/doctors/:doctorProfileId/availability
exports.updateDoctorAvailability = async (req, res, next) => {
  try {
    const { availability } = req.body;
    const profile = await DoctorProfile.findOneAndUpdate(
      { _id: req.params.doctorProfileId, clinic: req.user.clinicId },
      { availability },
      { new: true }
    ).populate('user', 'name email');
    if (!profile) return apiResponse(res, 404, 'Doctor profile not found in your clinic');
    apiResponse(res, 200, 'Availability updated', profile);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments for this clinic (optionally filtered by date)
// @route   GET /api/clinic/appointments
exports.getClinicAppointments = async (req, res, next) => {
  try {
    const Appointment = require('../models/Appointment');
    const { date } = req.query;
    const query = { clinic: req.user.clinicId };
    if (date) query.date = new Date(date);

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email')
      .populate('doctor', 'name email')
      .sort({ date: 1, timeSlot: 1 });

    apiResponse(res, 200, 'Appointments fetched', appointments);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve / cancel / reschedule appointment (clinic admin)
// @route   PUT /api/clinic/appointments/:id
exports.updateClinicAppointment = async (req, res, next) => {
  try {
    const Appointment = require('../models/Appointment');
    const { status, date, timeSlot } = req.body;
    const allowedStatuses = ['confirmed', 'cancelled', 'pending'];

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      clinic: req.user.clinicId
    });
    if (!appointment) return apiResponse(res, 404, 'Appointment not found in your clinic');

    if (status && allowedStatuses.includes(status)) appointment.status = status;
    if (date) appointment.date = new Date(date);
    if (timeSlot) appointment.timeSlot = timeSlot;

    await appointment.save();
    await appointment.populate('patient', 'name email');
    await appointment.populate('doctor', 'name email');

    apiResponse(res, 200, 'Appointment updated', appointment);
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient visit history (appointments + prescriptions) for this clinic
// @route   GET /api/clinic/patients/:patientId/history
exports.getPatientClinicHistory = async (req, res, next) => {
  try {
    const Appointment = require('../models/Appointment');
    const Prescription = require('../models/Prescription');

    const appointments = await Appointment.find({
      clinic: req.user.clinicId,
      patient: req.params.patientId
    }).populate('doctor', 'name').sort({ date: -1 });

    const prescriptions = await Prescription.find({
      clinic: req.user.clinicId,
      patient: req.params.patientId
    }).populate('doctor', 'name').sort({ createdAt: -1 });

    const patient = await User.findById(req.params.patientId).select('name email');

    apiResponse(res, 200, 'Patient history fetched', { patient, appointments, prescriptions });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all patients who visited this clinic
// @route   GET /api/clinic/patients
exports.getClinicPatients = async (req, res, next) => {
  try {
    const Appointment = require('../models/Appointment');
    const appointments = await Appointment.find({ clinic: req.user.clinicId })
      .populate('patient', 'name email')
      .sort({ createdAt: -1 });

    // Deduplicate patients
    const seen = new Set();
    const patients = [];
    for (const apt of appointments) {
      if (apt.patient && !seen.has(apt.patient._id.toString())) {
        seen.add(apt.patient._id.toString());
        patients.push({ ...apt.patient.toObject(), lastVisit: apt.date });
      }
    }
    apiResponse(res, 200, 'Patients fetched', patients);
  } catch (error) {
    next(error);
  }
};