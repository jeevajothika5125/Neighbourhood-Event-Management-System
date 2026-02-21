// Simple user storage utility for managing registered users
export const userStorage = {
  // Get all registered users
  getRegisteredUsers: () => {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : [];
  },

  // Add a new registered user
  addUser: (userData) => {
    const users = userStorage.getRegisteredUsers();
    users.push(userData);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
  },

  // Find user by username and role
  findUser: (username, role) => {
    const users = userStorage.getRegisteredUsers();
    return users.find(user => user.username === username && user.role === role);
  },

  // Validate login credentials
  validateLogin: (username, password, role) => {
    const user = userStorage.findUser(username, role);
    return user && user.password === password ? user : null;
  }
};

// Get user storage data
export const getUserStorage = () => {
  return userStorage.getRegisteredUsers();
};

// Update user data in storage
export const updateUserStorage = (email, updatedData) => {
  const users = userStorage.getRegisteredUsers();
  const userIndex = users.findIndex(user => user.email === email);
  
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updatedData };
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    return users[userIndex];
  }
  
  return null;
};