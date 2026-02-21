const API_BASE_URL = 'http://localhost:8080/api/analytics';

class AnalyticsService {
  async getAnalyticsStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch analytics stats:', error);
      return null;
    }
  }

  async getTopOrganizers() {
    try {
      const response = await fetch(`${API_BASE_URL}/top-organizers`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch top organizers:', error);
      return [];
    }
  }
}

const analyticsService = new AnalyticsService();
export default analyticsService;