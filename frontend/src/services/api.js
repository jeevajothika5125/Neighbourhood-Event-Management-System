const API_BASE_URL = 'http://localhost:8080/api';

// API utility functions
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      // Handle specific error responses
      if (data.error) {
        throw new Error(data.error);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// User Authentication APIs
export const userAPI = {
  register: (userData) => apiCall('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => apiCall('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  getAllUsers: () => apiCall('/users'),
  
  getUsersByRole: (role) => apiCall(`/users/role/${role}`),
  
  updateUser: (id, userData) => apiCall(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  
  deleteUser: (id) => apiCall(`/users/${id}`, {
    method: 'DELETE',
  }),
};

// Event Management APIs
export const eventAPI = {
  getAllEvents: () => apiCall('/events'),
  
  getApprovedEvents: () => apiCall('/events/approved'),
  
  getPendingEvents: () => apiCall('/events/pending'),
  
  getEventsByOrganizer: (organizerName) => apiCall(`/events/organizer/${organizerName}`),
  
  createEvent: (eventData) => apiCall('/events', {
    method: 'POST',
    body: JSON.stringify(eventData),
  }),
  
  updateEvent: (id, eventData) => apiCall(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData),
  }),
  
  updateEventStatus: (id, status) => apiCall(`/events/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(status),
  }),
  
  deleteEvent: (id) => apiCall(`/events/${id}`, {
    method: 'DELETE',
  }),
};

// Event Registration APIs
export const registrationAPI = {
  getAllRegistrations: () => apiCall('/registrations'),
  
  getUserRegistrations: (userId) => apiCall(`/registrations/user/${userId}`),
  
  getEventRegistrations: (eventId) => apiCall(`/registrations/event/${eventId}`),
  
  getOrganizerRegistrations: (organizerName) => apiCall(`/registrations/organizer/${organizerName}`),
  
  registerForEvent: (registrationData) => apiCall('/registrations', {
    method: 'POST',
    body: JSON.stringify(registrationData),
  }),
  
  cancelRegistration: (eventId, userId) => apiCall(`/registrations/event/${eventId}/user/${userId}`, {
    method: 'DELETE',
  }),
  
  markAttended: (id, attended) => apiCall(`/registrations/${id}/attended`, {
    method: 'PUT',
    body: JSON.stringify(attended),
  }),
};

const api = { userAPI, eventAPI, registrationAPI };
export default api;