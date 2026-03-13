export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  CLINIC_ADMIN: 'clinic_admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient',
};

export const hasPermission = (user, allowedRoles) => {
  if (!user || !user.role) return false;
  return allowedRoles.includes(user.role);
};