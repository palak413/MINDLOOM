import { create } from 'zustand';

// --- Hardcoded Playlist (Frontend-Only Approach) ---
const playlist = [
    {
        id: 1,
        title: "Calm Meditation",
        artist: "Mindloom",
        src: "/audio/meditation-calm.mp3",
        artwork: "/images/artwork-1.png"
    },
    {
        id: 2,
        title: "Focus Flow State",
        artist: "Mindloom",
        src: "/audio/focus-flow.mp3",
        artwork: "/images/artwork-2.png"
    },
    {
        id: 3,
        title: "Deep Sleep Soundscape",
        artist: "Mindloom",
        src: "/audio/sleep-soundscape.mp3",
        artwork: "/images/artwork-3.png"
    }
];

const useAppStore = create((set, get) => ({
    // --- Existing State ---
    points: 0,
    streak: 0,
    plantHealth: 100,
    setPoints: (points) => set({ points }),
    setStreak: (streak) => set({ streak }),
    setPlantHealth: (health) => set({ plantHealth: health }),

    // --- New Music Player State ---
    playlist: playlist,
    currentTrackIndex: -1, // -1 means no track is selected
    isPlaying: false,
    
    // --- New Music Player Actions ---
    playTrack: (trackIndex) => set({ currentTrackIndex: trackIndex, isPlaying: true }),
    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    nextTrack: () => set((state) => ({
        currentTrackIndex: (state.currentTrackIndex + 1) % state.playlist.length
    })),
    prevTrack: () => set((state) => ({
        currentTrackIndex: (state.currentTrackIndex - 1 + state.playlist.length) % state.playlist.length
    })),
}));

export default useAppStore;