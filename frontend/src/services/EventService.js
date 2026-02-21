const API_BASE_URL = 'http://localhost:8080/api/events';

class EventService {
  async createEvent(eventData) {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create event:', error);
      throw error;
    }
  }

  async getAllEvents() {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch events:', error);
      return [];
    }
  }

  async getApprovedEvents() {
    try {
      const response = await fetch(`${API_BASE_URL}/approved`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch approved events:', error);
      return [];
    }
  }

  async getEventsByOrganizer(organizerName) {
    try {
      const response = await fetch(`${API_BASE_URL}/organizer/${organizerName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch organizer events:', error);
      return [];
    }
  }

  async getPendingEvents() {
    try {
      const response = await fetch(`${API_BASE_URL}/pending`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch pending events:', error);
      return [];
    }
  }

  async updateEventStatus(eventId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/${eventId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: `"${status}"`,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update event status:', error);
      throw error;
    }
  }
}

const eventService = new EventService();
export default eventService;