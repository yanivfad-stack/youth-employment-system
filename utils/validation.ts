// Validation utilities

/**
 * Validates an Israeli ID number using the Luhn algorithm
 * Israeli IDs are 9 digits long
 */
export const validateIsraeliId = (id: string): boolean => {
  const id_str = id.trim();

  // Check if it's exactly 9 digits
  if (!/^\d{9}$/.test(id_str)) {
    return false;
  }

  // Luhn algorithm
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = parseInt(id_str[i], 10);

    // Multiply every other digit (starting from the second) by 2
    if ((i + 1) % 2 === 0) {
      digit *= 2;
      // If the result is greater than 9, subtract 9
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
  }

  // Valid if sum is divisible by 10
  return sum % 10 === 0;
};

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates Israeli phone number (starts with +972 or 0)
 */
export const validateIsraeliPhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^(\+972|0)[1-9]\d{8,9}$/;
  return phoneRegex.test(phoneNumber.replace(/[\s\-()]/g, ''));
};

/**
 * Validates GPS coordinates
 */
export const validateGpsCoordinates = (lat: number, lng: number): boolean => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};
