import { create } from 'zustand';
import { authAPI, dashboardAPI } from '../services/api';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  // Login action
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login({ email, password });
      const { data } = response.data;
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false
      });
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Register action
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.register(userData);
      const { data } = response.data;
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false
      });
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Logout action
  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({
        user: null,
        token: null,
        isAuthenticated: false
      });
    }
  },

  // Fetch current user
  fetchCurrentUser: async () => {
    set({ isLoading: true });
    try {
      const response = await authAPI.getMe();
      const { data } = response.data;
      
      localStorage.setItem('user', JSON.stringify(data.user));
      
      set({
        user: data.user,
        isLoading: false
      });
      
      return { success: true, data: data.user };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch user';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.changePassword({
        currentPassword,
        newPassword,
        confirmPassword: newPassword
      });
      const { data } = response.data;
      
      localStorage.setItem('token', data.token);
      
      set({ token: data.token, isLoading: false });
      
      // Refresh user data
      await get().fetchCurrentUser();
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Clear error
  clearError: () => set({ error: null })
}));

export default useAuthStore;