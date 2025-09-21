import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';
import { apiError } from '../utils/apiError.js';

const router = Router();

// Meditation and Music Data with Working URLs
const meditationTracks = [
  {
    id: 1,
    title: "Ocean Waves",
    artist: "Nature Sounds",
    duration: "10:00",
    type: "nature",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    color: "from-blue-400 to-cyan-500",
    category: "nature",
    description: "Gentle ocean waves for deep relaxation"
  },
  {
    id: 2,
    title: "Forest Rain",
    artist: "Ambient Nature",
    duration: "15:00",
    type: "nature",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    color: "from-green-400 to-emerald-500",
    category: "nature",
    description: "Peaceful rain sounds in a forest setting"
  },
  {
    id: 3,
    title: "Zen Meditation",
    artist: "Peaceful Sounds",
    duration: "20:00",
    type: "meditation",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    color: "from-purple-400 to-violet-500",
    category: "meditation",
    description: "Traditional zen meditation music"
  },
  {
    id: 4,
    title: "Mountain Breeze",
    artist: "Calm Nature",
    duration: "12:00",
    type: "nature",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    color: "from-indigo-400 to-blue-500",
    category: "nature",
    description: "Gentle mountain breeze sounds"
  },
  {
    id: 5,
    title: "Inner Peace",
    artist: "Meditation Music",
    duration: "25:00",
    type: "meditation",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    color: "from-pink-400 to-rose-500",
    category: "meditation",
    description: "Deep meditation music for inner peace"
  },
  {
    id: 6,
    title: "Sleep Sounds",
    artist: "Sleep Therapy",
    duration: "30:00",
    type: "sleep",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    color: "from-slate-400 to-gray-500",
    category: "sleep",
    description: "Calming sounds for better sleep"
  }
];

const meditationVideos = [
  {
    id: 1,
    title: "5-Minute Breathing Exercise",
    instructor: "Dr. Sarah Chen",
    duration: "5:30",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    type: "breathing",
    category: "breathing",
    description: "Quick breathing exercise for stress relief",
    difficulty: "beginner"
  },
  {
    id: 2,
    title: "Morning Meditation",
    instructor: "Zen Master Lee",
    duration: "10:15",
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    type: "meditation",
    category: "meditation",
    description: "Start your day with peaceful meditation",
    difficulty: "beginner"
  },
  {
    id: 3,
    title: "Stress Relief Yoga",
    instructor: "Yoga Instructor Maya",
    duration: "15:45",
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    type: "yoga",
    category: "yoga",
    description: "Gentle yoga poses for stress relief",
    difficulty: "intermediate"
  },
  {
    id: 4,
    title: "Sleep Meditation",
    instructor: "Sleep Expert Alex",
    duration: "20:00",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    type: "sleep",
    category: "sleep",
    description: "Guided meditation for better sleep",
    difficulty: "beginner"
  },
  {
    id: 5,
    title: "Mindfulness Walk",
    instructor: "Mindfulness Coach Sam",
    duration: "12:30",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    type: "mindfulness",
    category: "mindfulness",
    description: "Guided mindfulness walking meditation",
    difficulty: "beginner"
  },
  {
    id: 6,
    title: "Body Scan Meditation",
    instructor: "Meditation Teacher Lisa",
    duration: "18:00",
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    type: "meditation",
    category: "meditation",
    description: "Progressive body scan for deep relaxation",
    difficulty: "intermediate"
  }
];

// Get all meditation tracks
const getMeditationTracks = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new apiResponse(200, { tracks: meditationTracks }, "Meditation tracks retrieved successfully")
  );
});

// Get meditation tracks by category
const getMeditationTracksByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  
  if (!category) {
    throw new apiError(400, "Category is required");
  }
  
  const filteredTracks = meditationTracks.filter(track => track.category === category);
  
  return res.status(200).json(
    new apiResponse(200, { tracks: filteredTracks }, `${category} meditation tracks retrieved successfully`)
  );
});

// Get all meditation videos
const getMeditationVideos = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new apiResponse(200, { videos: meditationVideos }, "Meditation videos retrieved successfully")
  );
});

// Get meditation videos by category
const getMeditationVideosByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  
  if (!category) {
    throw new apiError(400, "Category is required");
  }
  
  const filteredVideos = meditationVideos.filter(video => video.category === category);
  
  return res.status(200).json(
    new apiResponse(200, { videos: filteredVideos }, `${category} meditation videos retrieved successfully`)
  );
});

// Get meditation videos by difficulty
const getMeditationVideosByDifficulty = asyncHandler(async (req, res) => {
  const { difficulty } = req.params;
  
  if (!difficulty) {
    throw new apiError(400, "Difficulty level is required");
  }
  
  const filteredVideos = meditationVideos.filter(video => video.difficulty === difficulty);
  
  return res.status(200).json(
    new apiResponse(200, { videos: filteredVideos }, `${difficulty} level meditation videos retrieved successfully`)
  );
});

// Get specific meditation track
const getMeditationTrack = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const track = meditationTracks.find(t => t.id === parseInt(id));
  
  if (!track) {
    throw new apiError(404, "Meditation track not found");
  }
  
  return res.status(200).json(
    new apiResponse(200, { track }, "Meditation track retrieved successfully")
  );
});

// Get specific meditation video
const getMeditationVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const video = meditationVideos.find(v => v.id === parseInt(id));
  
  if (!video) {
    throw new apiError(404, "Meditation video not found");
  }
  
  return res.status(200).json(
    new apiResponse(200, { video }, "Meditation video retrieved successfully")
  );
});

// Get meditation categories
const getMeditationCategories = asyncHandler(async (req, res) => {
  const trackCategories = [...new Set(meditationTracks.map(track => track.category))];
  const videoCategories = [...new Set(meditationVideos.map(video => video.category))];
  
  const categories = {
    tracks: trackCategories,
    videos: videoCategories,
    all: [...new Set([...trackCategories, ...videoCategories])]
  };
  
  return res.status(200).json(
    new apiResponse(200, { categories }, "Meditation categories retrieved successfully")
  );
});

// Routes
router.route('/tracks').get(getMeditationTracks);
router.route('/tracks/category/:category').get(getMeditationTracksByCategory);
router.route('/tracks/:id').get(getMeditationTrack);
router.route('/videos').get(getMeditationVideos);
router.route('/videos/category/:category').get(getMeditationVideosByCategory);
router.route('/videos/difficulty/:difficulty').get(getMeditationVideosByDifficulty);
router.route('/videos/:id').get(getMeditationVideo);
router.route('/categories').get(getMeditationCategories);

export default router;