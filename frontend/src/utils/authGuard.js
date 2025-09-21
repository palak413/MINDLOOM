// Authentication guard utility
export const authGuard = {
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('accessToken');
    return !!token;
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('accessToken');
  },

  // Redirect to login if not authenticated
  requireAuth: () => {
    if (!authGuard.isAuthenticated()) {
      window.location.href = '/login';
      return false;
    }
    return true;
  },

  // Clear authentication
  clearAuth: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }
};
