import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, 
  Droplets, 
  Sun, 
  Cloud, 
  CloudRain, 
  Zap,
  TrendingUp,
  Heart,
  Calendar,
  Sparkles,
  Zap as Lightning,
  Flower2,
  TreePine,
  Sprout,
  Bug,
  Shield,
  Star,
  Gift,
  Target,
  Award,
  Play,
  Pause,
  RotateCcw,
  Music,
  Camera,
  Share2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { plantAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { PlantTargetGame, MusicGardenGame, PlantPuzzleGame } from '../../components/PlantGames/PlantGames';

const PlantCare = () => {
  const [plant, setPlant] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWatering, setIsWatering] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentMusicTrack, setCurrentMusicTrack] = useState(0);
  const [musicTracks, setMusicTracks] = useState([
    {
      id: 1,
      title: "Forest Rain",
      artist: "Nature Sounds",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // CORS-free URL
      duration: "10:00",
      emoji: "🌧️"
    },
    {
      id: 2,
      title: "Ocean Waves",
      artist: "Calm Nature",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", // CORS-free URL
      duration: "15:00",
      emoji: "🌊"
    },
    {
      id: 3,
      title: "Bird Songs",
      artist: "Morning Chorus",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", // CORS-free URL
      duration: "12:00",
      emoji: "🐦"
    },
    {
      id: 4,
      title: "Zen Garden",
      artist: "Peaceful Sounds",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", // CORS-free URL
      duration: "20:00",
      emoji: "🧘"
    },
    {
      id: 5,
      title: "Gentle Wind",
      artist: "Nature Ambience",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", // CORS-free URL
      duration: "18:00",
      emoji: "🍃"
    }
  ]);
  const [showPlantCollection, setShowPlantCollection] = useState(false);
  const [activeTab, setActiveTab] = useState('care');
  const [lastWatered, setLastWatered] = useState(null);
  const [plantMood, setPlantMood] = useState('happy');
  const [achievements, setAchievements] = useState([]);
  const [activeGame, setActiveGame] = useState(null);
  const [gameScore, setGameScore] = useState(0);

  // Plant collection data
  const [plantCollection] = useState([
    { id: 1, name: 'Sunflower', type: 'flower', unlocked: true, rarity: 'common', emoji: '🌻' },
    { id: 2, name: 'Rose', type: 'flower', unlocked: true, rarity: 'common', emoji: '🌹' },
    { id: 3, name: 'Cactus', type: 'succulent', unlocked: false, rarity: 'rare', emoji: '🌵' },
    { id: 4, name: 'Bamboo', type: 'tree', unlocked: false, rarity: 'epic', emoji: '🎋' },
    { id: 5, name: 'Lotus', type: 'flower', unlocked: false, rarity: 'legendary', emoji: '🪷' },
    { id: 6, name: 'Cherry Blossom', type: 'tree', unlocked: false, rarity: 'legendary', emoji: '🌸' }
  ]);

  useEffect(() => {
    fetchPlant();
    generateAchievements();
  }, []);

  const fetchPlant = async () => {
    setIsLoading(true);
    try {
      const response = await plantAPI.getPlant();
      setPlant(response.data.data);
      setLastWatered(response.data.data?.lastWatered);
      updatePlantMood(response.data.data);
    } catch (error) {
      console.error('Error fetching plant:', error);
      // Create a default plant if none exists
      setPlant({
        growthPoints: 0,
        growthLevel: 1,
        healthStatus: 'healthy',
        lastWatered: new Date(),
        weather: 'sunny',
        name: 'My First Plant',
        species: 'Sunflower'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlantMood = (plantData) => {
    if (!plantData) return;
    
    const hoursSinceWatered = plantData.lastWatered ? 
      (Date.now() - new Date(plantData.lastWatered).getTime()) / (1000 * 60 * 60) : 24;
    
    if (hoursSinceWatered < 6) {
      setPlantMood('happy');
    } else if (hoursSinceWatered < 12) {
      setPlantMood('thirsty');
    } else if (hoursSinceWatered < 24) {
      setPlantMood('sad');
    } else {
      setPlantMood('dying');
    }
  };

  const generateAchievements = () => {
    setAchievements([
      { id: 1, title: 'First Sprout', description: 'Grow your first plant', unlocked: true, icon: Sprout },
      { id: 2, title: 'Green Thumb', description: 'Water 10 times', unlocked: false, icon: Droplets },
      { id: 3, title: 'Plant Parent', description: 'Reach level 5', unlocked: false, icon: Heart },
      { id: 4, title: 'Collection Master', description: 'Unlock 5 plants', unlocked: false, icon: Star },
      { id: 5, title: 'Music Lover', description: 'Play music for plant', unlocked: false, icon: Music }
    ]);
  };

  const handleWaterPlant = async () => {
    if (isWatering) return;
    
    setIsWatering(true);
    
    // Animate watering
    setTimeout(async () => {
      try {
        const response = await plantAPI.waterPlant();
        setPlant(response.data.data);
        setLastWatered(new Date());
        updatePlantMood(response.data.data);
        toast.success('Plant watered! 🌱');
      } catch (error) {
        console.error('Error watering plant:', error);
        toast.error('Failed to water plant');
      } finally {
        setIsWatering(false);
      }
    }, 2000);
  };

  const handlePlayMusic = () => {
    if (isPlayingMusic) {
      setIsPlayingMusic(false);
      toast.success('Music stopped 🎵');
    } else {
      setIsPlayingMusic(true);
      toast.success(`Playing ${musicTracks[currentMusicTrack].title} for your plant 🎶`);
      
      // Here you can add actual audio playback logic
      // For now, we'll just show the visual feedback
      console.log('Playing music:', musicTracks[currentMusicTrack]);
    }
  };

  const handleNextTrack = () => {
    const nextTrack = (currentMusicTrack + 1) % musicTracks.length;
    setCurrentMusicTrack(nextTrack);
    toast.success(`Switched to ${musicTracks[nextTrack].title} 🎵`);
  };

  const handlePrevTrack = () => {
    const prevTrack = currentMusicTrack === 0 ? musicTracks.length - 1 : currentMusicTrack - 1;
    setCurrentMusicTrack(prevTrack);
    toast.success(`Switched to ${musicTracks[prevTrack].title} 🎵`);
  };

  const handleGameStart = (gameType) => {
    setActiveGame(gameType);
  };

  const handleGameClose = () => {
    setActiveGame(null);
  };

  const handleGameScore = (score) => {
    setGameScore(score);
    toast.success(`Great job! You earned ${score} points! 🎉`);
  };

  const getPlantEmoji = (level) => {
    const emojis = ['🌱', '🌿', '🌳', '🌲', '🌴', '🌸', '🌺', '🌻', '🌷', '🌹'];
    return emojis[Math.min(level - 1, emojis.length - 1)];
  };

  const getMoodColor = (mood) => {
    const colors = {
      happy: 'from-green-400 to-emerald-500',
      thirsty: 'from-yellow-400 to-orange-500',
      sad: 'from-blue-400 to-indigo-500',
      dying: 'from-red-400 to-pink-500'
    };
    return colors[mood] || colors.happy;
  };

  const getMoodEmoji = (mood) => {
    const emojis = {
      happy: '😊',
      thirsty: '😰',
      sad: '😢',
      dying: '💀'
    };
    return emojis[mood] || emojis.happy;
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: 'text-gray-500',
      rare: 'text-blue-500',
      epic: 'text-purple-500',
      legendary: 'text-yellow-500'
    };
    return colors[rarity] || colors.common;
  };

  const getRarityBg = (rarity) => {
    const colors = {
      common: 'bg-gray-100',
      rare: 'bg-blue-100',
      epic: 'bg-purple-100',
      legendary: 'bg-yellow-100'
    };
    return colors[rarity] || colors.common;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating Leaves */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-green-400/20 text-6xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            🍃
          </motion.div>
        ))}
        
        {/* Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-300/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            🌱 Plant Paradise 🌱
          </h1>
          <p className="text-gray-600 text-xl">
            Nurture your virtual garden and watch it flourish!
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
            {[
              { id: 'care', label: 'Plant Care', icon: Heart },
              { id: 'collection', label: 'Collection', icon: Star },
              { id: 'achievements', label: 'Achievements', icon: Award },
              { id: 'games', label: 'Mini Games', icon: Play }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-green-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'care' && (
            <motion.div
              key="care"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Plant Status Card */}
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-8xl"
                    >
                      {getPlantEmoji(plant?.growthLevel || 1)}
                    </motion.div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">
                        {plant?.name || 'My Plant'}
                      </h2>
                      <p className="text-gray-600 text-lg">
                        {plant?.species || 'Sunflower'} • Level {plant?.growthLevel || 1}
                      </p>
                    </div>
                  </div>
                  
                  {/* Plant Mood Indicator */}
                  <div className={`px-4 py-2 rounded-2xl bg-gradient-to-r ${getMoodColor(plantMood)} text-white`}>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getMoodEmoji(plantMood)}</span>
                      <span className="font-semibold capitalize">{plantMood}</span>
                    </div>
                  </div>
                </div>

                {/* Plant Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Growth Points</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {plant?.growthPoints || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Health</p>
                        <p className="text-2xl font-bold text-green-600 capitalize">
                          {plant?.healthStatus || 'Healthy'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Last Watered</p>
                        <p className="text-lg font-bold text-yellow-600">
                          {lastWatered ? new Date(lastWatered).toLocaleDateString() : 'Never'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Streak</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {plant?.streak || 0} days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Music Track Info */}
                {isPlayingMusic && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border border-purple-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{musicTracks[currentMusicTrack].emoji}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{musicTracks[currentMusicTrack].title}</h4>
                        <p className="text-gray-600 text-sm">{musicTracks[currentMusicTrack].artist}</p>
                        <p className="text-gray-500 text-xs">{musicTracks[currentMusicTrack].duration}</p>
                      </div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                      >
                        <Music className="w-4 h-4 text-white" />
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWaterPlant}
                    disabled={isWatering}
                    className={`flex items-center space-x-3 px-6 py-4 rounded-2xl font-semibold text-white transition-all duration-200 ${
                      isWatering
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg'
                    }`}
                  >
                    <motion.div
                      animate={isWatering ? { rotate: 360 } : {}}
                      transition={{ duration: 1, repeat: isWatering ? Infinity : 0 }}
                    >
                      <Droplets className="w-6 h-6" />
                    </motion.div>
                    <span>{isWatering ? 'Watering...' : 'Water Plant'}</span>
                  </motion.button>

                  {/* Music Player */}
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePrevTrack}
                      className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg transition-all duration-200"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePlayMusic}
                      className={`flex items-center space-x-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-200 ${
                        isPlayingMusic
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                      } shadow-lg`}
                    >
                      <Music className="w-6 h-6" />
                      <span>{isPlayingMusic ? 'Stop Music' : 'Play Music'}</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNextTrack}
                      className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg transition-all duration-200"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-3 px-6 py-4 rounded-2xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg transition-all duration-200"
                  >
                    <Camera className="w-6 h-6" />
                    <span>Take Photo</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-3 px-6 py-4 rounded-2xl font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 shadow-lg transition-all duration-200"
                  >
                    <Share2 className="w-6 h-6" />
                    <span>Share</span>
                  </motion.button>
                </div>
              </div>

              {/* Weather and Environment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                    <Sun className="w-6 h-6 text-yellow-500" />
                    <span>Weather</span>
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">☀️</div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">Sunny</p>
                      <p className="text-gray-600">Perfect for growth!</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                    <Bug className="w-6 h-6 text-green-500" />
                    <span>Pests</span>
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">🛡️</div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">Protected</p>
                      <p className="text-gray-600">No pests detected</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'collection' && (
            <motion.div
              key="collection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Plant Collection</h2>
                <p className="text-gray-600">Discover and collect different plant species!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plantCollection.map((plant) => (
                  <motion.div
                    key={plant.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`rounded-3xl p-6 border-2 transition-all duration-200 ${
                      plant.unlocked
                        ? 'bg-white/90 backdrop-blur-xl border-green-200 shadow-lg'
                        : 'bg-gray-100/50 backdrop-blur-xl border-gray-200'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4">{plant.emoji}</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{plant.name}</h3>
                      <p className="text-gray-600 mb-3 capitalize">{plant.type}</p>
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRarityBg(plant.rarity)} ${getRarityColor(plant.rarity)}`}>
                        {plant.rarity}
                      </div>
                      {!plant.unlocked && (
                        <p className="text-sm text-gray-500 mt-3">
                          Complete tasks to unlock
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Achievements</h2>
                <p className="text-gray-600">Track your plant care progress!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ scale: 1.02 }}
                    className={`rounded-3xl p-6 border-2 transition-all duration-200 ${
                      achievement.unlocked
                        ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300 shadow-lg'
                        : 'bg-gray-100/50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                        achievement.unlocked ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gray-400'
                      }`}>
                        <achievement.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{achievement.title}</h3>
                        <p className="text-gray-600">{achievement.description}</p>
                        {achievement.unlocked && (
                          <div className="flex items-center space-x-1 mt-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium text-yellow-600">Unlocked!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Mini Games</h2>
                <p className="text-gray-600">Have fun while caring for your plants!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-3xl p-6 border border-blue-200 shadow-lg cursor-pointer"
                  onClick={() => handleGameStart('target')}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Plant Target</h3>
                    <p className="text-gray-600 mb-4">Water the right plants to earn points!</p>
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200">
                      Play Now
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-3xl p-6 border border-green-200 shadow-lg cursor-pointer"
                  onClick={() => handleGameStart('puzzle')}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">🧩</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Plant Puzzle</h3>
                    <p className="text-gray-600 mb-4">Match plant parts to grow faster!</p>
                    <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200">
                      Play Now
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-6 border border-purple-200 shadow-lg cursor-pointer"
                  onClick={() => handleGameStart('music')}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎵</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Music Garden</h3>
                    <p className="text-gray-600 mb-4">Create melodies for your plants!</p>
                    <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
                      Play Now
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-3xl p-6 border border-yellow-200 shadow-lg cursor-pointer"
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">🏃</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Garden Run</h3>
                    <p className="text-gray-600 mb-4">Run through your garden collecting seeds!</p>
                    <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-200">
                      Coming Soon
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Components */}
        {activeGame === 'target' && (
          <PlantTargetGame onClose={handleGameClose} onScore={handleGameScore} />
        )}
        {activeGame === 'music' && (
          <MusicGardenGame onClose={handleGameClose} />
        )}
        {activeGame === 'puzzle' && (
          <PlantPuzzleGame onClose={handleGameClose} />
        )}
      </div>
    </div>
  );
};

export default PlantCare;