const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
  diagnosis: { type: String, required: true },
  medicines: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true }, // e.g., "1-0-1"
    duration: { type: String, required: true } // e.g., "5 days"
  }],
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);