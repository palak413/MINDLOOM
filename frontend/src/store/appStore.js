import { create } from 'zustand';

const useAppStore = create((set) => ({
  // Add your app state here
  user: null,
  setUser: (user) => set({ user }),
  
  // Music/meditation state
  currentTrack: null,
  isPlaying: false,
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
}));

export default useAppStore;
