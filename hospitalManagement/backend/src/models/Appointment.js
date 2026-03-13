const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // e.g., "10:30"
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  type: {
    type: String,
    enum: ['online', 'walk-in'],
    default: 'online'
  },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);