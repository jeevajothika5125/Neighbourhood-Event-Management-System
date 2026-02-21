export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateEventForm = (eventData) => {
  const errors = {};
  
  if (!validateRequired(eventData.eventName)) {
    errors.eventName = 'Event name is required';
  }
  
  if (!validateRequired(eventData.description)) {
    errors.description = 'Description is required';
  }
  
  if (!validateRequired(eventData.eventDate)) {
    errors.eventDate = 'Event date is required';
  }
  
  if (!validateRequired(eventData.location)) {
    errors.location = 'Location is required';
  }
  
  if (eventData.contactNumber && !validatePhone(eventData.contactNumber)) {
    errors.contactNumber = 'Invalid phone number';
  }
  
  return errors;
};

export const validateLoginForm = (loginData) => {
  const errors = {};
  
  if (!validateRequired(loginData.username)) {
    errors.username = 'Username is required';
  }
  
  if (!validateRequired(loginData.password)) {
    errors.password = 'Password is required';
  }
  
  return errors;
};

export const validateRegisterForm = (registerData) => {
  const errors = {};
  
  if (!validateRequired(registerData.username)) {
    errors.username = 'Username is required';
  }
  
  if (!validateEmail(registerData.email)) {
    errors.email = 'Valid email is required';
  }
  
  if (!validatePassword(registerData.password)) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return errors;
};