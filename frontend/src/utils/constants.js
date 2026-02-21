export const API_BASE_URL = 'http://localhost:8081/api';

export const USER_ROLES = {
  ADMIN: 'Admin',
  ORGANIZER: 'Organizer',
  PARTICIPANT: 'Participant'
};

export const EVENT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED'
};

export const REGISTRATION_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  EVENTS: '/events',
  PROFILE: '/profile'
};