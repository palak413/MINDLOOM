import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI, userAPI } from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.login(credentials);
          const user = response.data.data.user;
          const accessToken = response.data.data.accessToken;
          
          // Store token in localStorage
          if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
          }
          
          set({ user, isAuthenticated: true, isLoading: false });
          return { success: true, user };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.response?.data?.message };
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.register(userData);
          const user = response.data.data.user;
          const accessToken = response.data.data.accessToken;
          
          // Store token in localStorage
          if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
          }
          
          set({ user, isAuthenticated: true, isLoading: false });
          return { success: true, user };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.response?.data?.message };
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear token from localStorage
          localStorage.removeItem('accessToken');
          set({ user: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('accessToken');
        
        // If no token, skip the API call
        if (!token) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          return false;
        }
        
        set({ isLoading: true });
        try {
          const response = await userAPI.getProfile();
          const user = response.data.data;
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error) {
          // If API call fails, clear the token and user data
          localStorage.removeItem('accessToken');
          set({ user: null, isAuthenticated: false, isLoading: false });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
