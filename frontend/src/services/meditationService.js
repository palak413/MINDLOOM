import api from './api';

const MeditationAPI = {
  // Get all meditation tracks
  getMeditationTracks: async () => {
    try {
      const response = await api.get('/api/v1/meditation/tracks');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching meditation tracks:', error);
      throw error;
    }
  },

  // Get meditation tracks by category
  getMeditationTracksByCategory: async (category) => {
    try {
      const response = await api.get(`/api/v1/meditation/tracks/category/${category}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching meditation tracks by category:', error);
      throw error;
    }
  },

  // Get specific meditation track
  getMeditationTrack: async (id) => {
    try {
      const response = await api.get(`/api/v1/meditation/tracks/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching meditation track:', error);
      throw error;
    }
  },

  // Get all meditation videos
  getMeditationVideos: async () => {
    try {
      const response = await api.get('/api/v1/meditation/videos');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching meditation videos:', error);
      throw error;
    }
  },

  // Get meditation videos by category
  getMeditationVideosByCategory: async (category) => {
    try {
      const response = await api.get(`/api/v1/meditation/videos/category/${category}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching meditation videos by category:', error);
      throw error;
    }
  },

  // Get meditation videos by difficulty
  getMeditationVideosByDifficulty: async (difficulty) => {
    try {
      const response = await api.get(`/api/v1/meditation/videos/difficulty/${difficulty}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching meditation videos by difficulty:', error);
      throw error;
    }
  },

  // Get specific meditation video
  getMeditationVideo: async (id) => {
    try {
      const response = await api.get(`/api/v1/meditation/videos/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching meditation video:', error);
      throw error;
    }
  },

  // Get meditation categories
  getMeditationCategories: async () => {
    try {
      const response = await api.get('/api/v1/meditation/categories');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching meditation categories:', error);
      throw error;
    }
  }
};

export default MeditationAPI;
