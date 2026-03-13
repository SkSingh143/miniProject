const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const apiResponse = require('../utils/apiResponse');

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return apiResponse(res, 400, 'User already exists');
    }

    const user = await User.create({ name, email, password, role });

    if (user) {
      apiResponse(res, 201, 'User registered successfully', {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      apiResponse(res, 400, 'Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      apiResponse(res, 200, 'Login successful', {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        clinicId: user.clinicId, // Important for Clinic Admins/Doctors
        token: generateToken(user._id),
      });
    } else {
      apiResponse(res, 401, 'Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};
exports.getMe = async (req, res, next) => {
  try {
    // req.user._id should be set by your authentication middleware
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return apiResponse(res, 404, 'User not found');
    }

    apiResponse(res, 200, 'User details fetched successfully', {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        clinicId: user.clinicId,
      }
    });
  } catch (error) {
    next(error);
  }
};