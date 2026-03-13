const Clinic = require('../models/Clinic');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const apiResponse = require('../utils/apiResponse');

// @desc    Get all registered clinics (with optional status filter)
// @route   GET /api/admin/clinics
exports.getAllClinics = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;

    const clinics = await Clinic.find(query).sort({ createdAt: -1 });
    apiResponse(res, 200, 'Clinics fetched successfully', clinics);
  } catch (error) {
    next(error);
  }
};

// @desc    Activate or Deactivate a clinic
// @route   PUT /api/admin/clinics/:id/status
exports.updateClinicStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const clinic = await Clinic.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    );

    if (!clinic) {
      return apiResponse(res, 404, 'Clinic not found');
    }

    apiResponse(res, 200, `Clinic ${isActive ? 'activated' : 'deactivated'} successfully`, clinic);
  } catch (error) {
    next(error);
  }
};

// @desc    Get system-wide usage statistics
// @route   GET /api/admin/stats
exports.getSystemStats = async (req, res, next) => {
  try {
    const totalClinics = await Clinic.countDocuments();
    const activeClinics = await Clinic.countDocuments({ isActive: true });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalAppointments = await Appointment.countDocuments();

    const stats = {
      totalClinics,
      activeClinics,
      totalDoctors,
      totalPatients,
      totalAppointments
    };

    apiResponse(res, 200, 'System stats fetched successfully', stats);
  } catch (error) {
    next(error);
  }
};