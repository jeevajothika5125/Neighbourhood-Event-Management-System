export const notificationService = {
  showSuccess: (message) => {
    // You can integrate with toast libraries like react-toastify
    console.log('Success:', message);
  },

  showError: (message) => {
    console.error('Error:', message);
  },

  showInfo: (message) => {
    console.log('Info:', message);
  },

  showWarning: (message) => {
    console.warn('Warning:', message);
  }
};