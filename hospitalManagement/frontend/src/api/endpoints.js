export const API_ENDPOINTS = {
  // A. Authentication & Profile
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    UPDATE_PROFILE: '/user/profile',
  },

  // B. Super Admin Routes
  ADMIN: {
    CLINICS: '/admin/clinics', // POST to create, GET to list
    CLINIC_STATUS: (id) => `/admin/clinics/${id}/status`, // PUT to activate/deactivate
    STATS: '/admin/stats',
  },

  // C. Clinic Admin Routes
  CLINIC: {
    PROFILE: '/clinic/profile',
    DOCTORS: '/clinic/doctors',
    DOCTOR_AVAILABILITY: (profileId) => `/clinic/doctors/${profileId}/availability`,
    APPOINTMENTS: '/clinic/appointments',
    APPOINTMENT: (id) => `/clinic/appointments/${id}`,
    PATIENTS: '/clinic/patients',
    PATIENT_HISTORY: (patientId) => `/clinic/patients/${patientId}/history`,
  },

  // D. Doctor Routes
  DOCTOR: {
    APPOINTMENTS: '/doctor/appointments',
    UPDATE_STATUS: (id) => `/doctor/appointments/${id}/status`,
    AVAILABILITY: '/doctor/availability',
    PRESCRIPTIONS: '/doctor/prescriptions',
    PATIENT_DETAILS: (id) => `/doctor/patient/${id}`,
    PROFILE: '/doctor/profile',
  },

  // E. Appointment Routes
  APPOINTMENTS: {
    SLOTS: '/appointments/slots', // GET available slots
    BOOK: '/appointments/book',   // POST book slot
    WALK_IN: '/appointments/walk-in', // POST clinic admin only
    STATUS: (id) => `/appointments/${id}/status`, // PUT cancel/confirm
    HISTORY: '/appointments/history', // GET patient history
  },

  // F. Medicine Price Comparison
  MEDICINES: {
    SEARCH: '/medicines/search',
    COMPARE: '/medicines/compare',
  },

  // G. Patient Routes
  PATIENT: {
    CLINICS: '/patient/clinics',
    CLINIC_DOCTORS: (clinicId) => `/patient/clinics/${clinicId}/doctors`,
    APPOINTMENTS: '/patient/appointments',
    CANCEL: (id) => `/patient/appointments/${id}/cancel`,
    PRESCRIPTIONS: '/patient/prescriptions',
    PRESCRIPTION: (id) => `/patient/prescriptions/${id}`,
  },
};