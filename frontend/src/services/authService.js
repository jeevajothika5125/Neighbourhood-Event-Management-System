import { userAPI } from './api';

class AuthService {
  constructor() {
    this.currentUser = this.getCurrentUser();
  }

  async login(username, password, role) {
    try {
      // First try backend login (MySQL database)
      const credentials = { username, password };
      
      try {
        const user = await userAPI.login(credentials);
        
        if (user && user.role === role.toUpperCase()) {
          // Store user data
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUser = user;
          
          // Also update localStorage for compatibility
          const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          const existingUserIndex = registeredUsers.findIndex(u => u.username === username);
          
          if (existingUserIndex === -1) {
            registeredUsers.push({
              username: user.username,
              email: user.email,
              role: user.role,
              password: password // Store for localStorage compatibility
            });
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
          }
          
          return { success: true, user };
        } else if (user && user.role !== role.toUpperCase()) {
          return { success: false, message: `User is registered as ${user.role}, not ${role.toUpperCase()}` };
        }
      } catch (backendError) {
        console.log('Backend login failed, checking localStorage...', backendError);
      }
      
      // Fallback to localStorage if backend fails
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const localUser = registeredUsers.find(u => 
        u.username === username && u.password === password && u.role === role.toUpperCase()
      );
      
      if (localUser) {
        const user = {
          username: localUser.username,
          email: localUser.email,
          role: localUser.role
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
        return { success: true, user };
      }
      
      return { success: false, message: 'Invalid credentials or user not registered as ' + role };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  }

  async register(userData) {
    try {
      // First try backend registration (MySQL database)
      try {
        const user = await userAPI.register(userData);
        
        // If successful, add to localStorage for compatibility
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const existingUserIndex = registeredUsers.findIndex(u => 
          u.username === userData.username || u.email === userData.email
        );
        
        if (existingUserIndex === -1) {
          registeredUsers.push({
            username: userData.username,
            email: userData.email,
            role: userData.role,
            password: userData.password
          });
          localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        }
        
        return { success: true, user };
      } catch (backendError) {
        console.log('Backend registration failed, checking localStorage...', backendError);
        
        // If backend fails, check localStorage for duplicates
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const existingUser = registeredUsers.find(u => 
          u.username === userData.username || u.email === userData.email
        );
        
        if (existingUser) {
          if (existingUser.username === userData.username) {
            return { success: false, message: 'Username already exists' };
          }
          if (existingUser.email === userData.email) {
            return { success: false, message: 'Email already registered' };
          }
        }
        
        // If no duplicates in localStorage, add user there as fallback
        const newUser = {
          username: userData.username,
          email: userData.email,
          role: userData.role,
          password: userData.password
        };
        
        registeredUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        
        return { success: true, user: newUser };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
  }

  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }

  hasRole(role) {
    return this.currentUser && this.currentUser.role === role.toUpperCase();
  }

  async sendPasswordResetLink(email) {
    try {
      const response = await fetch('http://localhost:8080/api/forgot-password/send-reset-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return { success: true, message: data.message, resetLink: data.resetLink };
      } else {
        return { success: false, message: data.error };
      }
    } catch (error) {
      console.error('Password reset failed:', error);
      return { success: false, message: 'Failed to send reset link' };
    }
  }

  async resetPassword(token, password) {
    try {
      const response = await fetch('http://localhost:8080/api/forgot-password/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error };
      }
    } catch (error) {
      console.error('Password reset failed:', error);
      return { success: false, message: 'Failed to reset password' };
    }
  }
}

const authService = new AuthService();
export default authService;