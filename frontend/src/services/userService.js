const API_BASE_URL = 'http://localhost:8080/api/users';

class UserService {
  async getAllUsers() {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return [];
    }
  }

  async getUsersByRole(role) {
    try {
      const response = await fetch(`${API_BASE_URL}/role/${role}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch users by role:', error);
      return [];
    }
  }
}

const userService = new UserService();
export default userService;