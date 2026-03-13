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
    DOCTORS: '/clinic/doctors', // POST to add, GET to list
    PATIENTS: '/clinic/patients', // GET history
  },

  // D. Doctor Routes
  DOCTOR: {
    APPOINTMENTS: '/doctor/appointments',
    AVAILABILITY: '/doctor/availability',
    PRESCRIPTIONS: '/prescriptions',
    PATIENT_DETAILS: (id) => `/doctor/patient/${id}`,
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
};