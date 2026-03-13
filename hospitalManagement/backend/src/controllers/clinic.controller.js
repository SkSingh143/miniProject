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