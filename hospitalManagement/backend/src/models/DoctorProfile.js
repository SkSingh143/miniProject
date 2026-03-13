const mongoose = require('mongoose');

const doctorProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true }, // Years of experience
  availability: [{
    day: { type: String }, // e.g., "Monday"
    startTime: { type: String }, // "09:00"
    endTime: { type: String }   // "17:00"
  }],
}, { timestamps: true });

module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);