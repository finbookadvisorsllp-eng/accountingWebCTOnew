import { create } from 'zustand';
import { dashboardAPI } from '../services/api';

const useDashboardStore = create((set, get) => ({
  dashboardData: null,
  hierarchy: [],
  activities: [],
  isLoading: false,
  error: null,

  // Fetch dashboard data
  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await dashboardAPI.getDashboard();
      const { data } = response.data;
      
      set({
        dashboardData: data,
        isLoading: false
      });
      
      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch dashboard';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Fetch hierarchy data
  fetchHierarchy: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await dashboardAPI.getHierarchy();
      const { data } = response.data;
      
      set({
        hierarchy: data,
        isLoading: false
      });
      
      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch hierarchy';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Fetch recent activities
  fetchActivities: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await dashboardAPI.getActivities(params);
      const { data } = response.data;
      
      set({
        activities: data.activities,
        isLoading: false
      });
      
      return { success: true, data: data.activities };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch activities';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () => set({
    dashboardData: null,
    hierarchy: [],
    activities: [],
    isLoading: false,
    error: null
  })
}));

export default useDashboardStore;