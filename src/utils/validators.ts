/**
 * Validates whether the email matches standard format rules.
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength (minimum 6 characters for demo purposes).
 */
export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Validates phone numbers (standard 10+ digits).
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$|^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/[\s-()]/g, ''));
};

/**
 * Validates required text inputs.
 */
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};
