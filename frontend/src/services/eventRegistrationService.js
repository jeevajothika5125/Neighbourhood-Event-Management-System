const API_BASE_URL = 'http://localhost:8080/api';

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
      if (data.message) {
        throw new Error(data.message);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

class EventRegistrationService {
  async registerForEvent(registrationData) {
    try {
      const response = await apiCall('/event-registrations/register', {
        method: 'POST',
        body: JSON.stringify(registrationData),
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  async getUserRegistrations(username) {
    try {
      const response = await apiCall(`/event-registrations/user/${username}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch user registrations:', error);
      return [];
    }
  }

  async getEventRegistrations(eventId) {
    try {
      const response = await apiCall(`/event-registrations/event/${eventId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch event registrations:', error);
      return [];
    }
  }

  async getOrganizerRegistrations(organizerUsername) {
    try {
      const response = await apiCall(`/event-registrations/organizer/${organizerUsername}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch organizer registrations:', error);
      return [];
    }
  }

  async getEventRegistrationCount(eventId) {
    try {
      const response = await apiCall(`/event-registrations/count/event/${eventId}`);
      return response.count;
    } catch (error) {
      console.error('Failed to fetch event registration count:', error);
      return 0;
    }
  }

  async getOrganizerRegistrationCount(organizerUsername) {
    try {
      const response = await apiCall(`/event-registrations/count/organizer/${organizerUsername}`);
      return response.count;
    } catch (error) {
      console.error('Failed to fetch organizer registration count:', error);
      return 0;
    }
  }

  async checkRegistration(username, eventId) {
    try {
      const response = await apiCall(`/event-registrations/check/${username}/${eventId}`);
      return response.isRegistered;
    } catch (error) {
      console.error('Failed to check registration:', error);
      return false;
    }
  }

  async unregisterFromEvent(username, eventId) {
    try {
      const response = await apiCall(`/event-registrations/unregister/${username}/${eventId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Unregistration failed');
    }
  }
}

const eventRegistrationService = new EventRegistrationService();
export default eventRegistrationService;