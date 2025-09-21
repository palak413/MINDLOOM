import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward,
  Heart,
  Music,
  Video,
  Headphones,
  Moon,
  Sun,
  Wind,
  Waves,
  TreePine,
  Sparkles,
  Maximize2,
  Minimize2,
  RotateCcw,
  Settings
} from 'lucide-react';
import MeditationAPI from '../../services/meditationService';

const Meditation = () => {
  const [activeTab, setActiveTab] = useState('music');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [musicTracks, setMusicTracks] = useState([]);
  const [meditationVideos, setMeditationVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  // Fallback data with CORS-free audio URLs
  const fallbackMusicTracks = [
    {
      id: 1,
      title: "Ocean Waves",
      artist: "Nature Sounds",
      duration: "10:00",
      type: "nature",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      color: "from-blue-400 to-cyan-500"
    },
    {
      id: 2,
      title: "Forest Rain",
      artist: "Ambient Nature",
      duration: "15:00",
      type: "nature",
      url: "https://pixabay.com/music/ambient-rainforest-313442/",
      color: "from-green-400 to-emerald-500"
    },
    {
      id: 3,
      title: "Zen Meditation",
      artist: "Peaceful Sounds",
      duration: "20:00",
      type: "meditation",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      color: "from-purple-400 to-violet-500"
    },
    {
      id: 4,
      title: "Mountain Breeze",
      artist: "Calm Nature",
      duration: "12:00",
      type: "nature",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      color: "from-indigo-400 to-blue-500"
    },
    {
      id: 5,
      title: "Inner Peace",
      artist: "Meditation Music",
      duration: "25:00",
      type: "meditation",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      color: "from-pink-400 to-rose-500"
    }
  ];

  const fallbackMeditationVideos = [
    {
      id: 1,
      title: "5-Minute Breathing Exercise",
      instructor: "Dr. Sarah Chen",
      duration: "5:30",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      type: "breathing"
    },
    {
      id: 2,
      title: "Morning Meditation",
      instructor: "Zen Master Lee",
      duration: "10:15",
      thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      type: "meditation"
    },
    {
      id: 3,
      title: "Stress Relief Yoga",
      instructor: "Yoga Instructor Maya",
      duration: "15:45",
      thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      type: "yoga"
    },
    {
      id: 4,
      title: "Sleep Meditation",
      instructor: "Sleep Expert Alex",
      duration: "20:00",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      type: "sleep"
    }
  ];

  // Use API data or fallback data
  const currentTracks = musicTracks.length > 0 ? musicTracks : fallbackMusicTracks;
  const currentVideos = meditationVideos.length > 0 ? meditationVideos : fallbackMeditationVideos;

  // Fetch meditation data from API
  useEffect(() => {
    const fetchMeditationData = async () => {
      setLoading(true);
      try {
        const [tracksData, videosData] = await Promise.all([
          MeditationAPI.getMeditationTracks(),
          MeditationAPI.getMeditationVideos()
        ]);
        
        setMusicTracks(tracksData.tracks || []);
        setMeditationVideos(videosData.videos || []);
      } catch (error) {
        console.error('Error fetching meditation data:', error);
        // Fallback to empty arrays if API fails
        setMusicTracks([]);
        setMeditationVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMeditationData();
  }, []);

  // Audio Controls with Web Audio API fallback
  const togglePlayPause = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Error playing audio:', error);
        
        // Fallback: Generate audio using Web Audio API
        if (error.message.includes('NotSupportedError') || error.message.includes('no supported sources')) {
          console.log('Falling back to Web Audio API...');
          generateMeditationTone();
        } else {
          alert(`Unable to play audio: ${error.message}\n\nNote: The current URLs are video files (.mp4) being used as audio. For proper meditation music, you would need actual audio files (.mp3, .wav) or use a music streaming service.`);
        }
      }
    }
  };

  // Generate meditation tone using Web Audio API
  const generateMeditationTone = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Create a gentle meditation tone
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3 note
      oscillator.type = 'sine';
      
      // Gentle volume envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.5);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 2);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 2.5);
      
      setIsPlaying(true);
      
      // Stop after 2.5 seconds
      setTimeout(() => {
        setIsPlaying(false);
      }, 2500);
      
      console.log('Playing generated meditation tone...');
      
    } catch (error) {
      console.error('Error generating audio:', error);
      alert('Unable to generate audio. Please check your browser\'s audio permissions.');
    }
  };

  const nextTrack = () => {
    const next = (currentTrack + 1) % currentTracks.length;
    setCurrentTrack(next);
    if (isPlaying) {
      audioRef.current?.play();
    }
  };

  const previousTrack = () => {
    const prev = currentTrack === 0 ? currentTracks.length - 1 : currentTrack - 1;
    setCurrentTrack(prev);
    if (isPlaying) {
      audioRef.current?.play();
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
      } else {
        audioRef.current.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };

  // Video Controls
  const toggleVideoPlayPause = async () => {
    if (videoRef.current) {
      try {
        if (isVideoPlaying) {
          videoRef.current.pause();
          setIsVideoPlaying(false);
        } else {
          await videoRef.current.play();
          setIsVideoPlaying(true);
        }
      } catch (error) {
        console.error('Error playing video:', error);
        alert('Unable to play video. This may be due to browser restrictions or invalid video URL.');
      }
    }
  };

  const nextVideo = () => {
    const next = (currentVideo + 1) % currentVideos.length;
    setCurrentVideo(next);
    setIsVideoPlaying(false);
  };

  const previousVideo = () => {
    const prev = currentVideo === 0 ? currentVideos.length - 1 : currentVideo - 1;
    setCurrentVideo(prev);
    setIsVideoPlaying(false);
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  // Set audio source when track changes
  useEffect(() => {
    if (audioRef.current && currentTracks[currentTrack]) {
      audioRef.current.src = currentTracks[currentTrack].url;
      audioRef.current.load();
    }
  }, [currentTrack, currentTracks]);

  // Set video source when video changes
  useEffect(() => {
    if (videoRef.current && currentVideos[currentVideo]) {
      videoRef.current.src = currentVideos[currentVideo].videoUrl;
      videoRef.current.load();
    }
  }, [currentVideo, currentVideos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-2xl"
          animate={{
            x: [0, 120, 0],
            y: [0, -80, 0],
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-2xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 80, 0],
            scale: [1, 0.7, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        <motion.div
          className="absolute bottom-20 left-40 w-48 h-48 bg-gradient-to-r from-indigo-400/30 to-blue-400/30 rounded-full blur-2xl"
          animate={{
            x: [0, 80, 0],
            y: [0, -60, 0],
            scale: [1, 1.2, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6
          }}
        />
        
        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400/40 to-purple-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/50 to-purple-50/50"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <Headphones className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Meditation & Music
              </h1>
              <p className="text-gray-600 text-lg">Find your inner peace</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setActiveTab('music')}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                activeTab === 'music'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white/90 text-purple-600 hover:bg-white shadow-md'
              }`}
            >
              <Music className="w-5 h-5 inline mr-2" />
              Music
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                activeTab === 'videos'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white/90 text-purple-600 hover:bg-white shadow-md'
              }`}
            >
              <Video className="w-5 h-5 inline mr-2" />
              Videos
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'music' && (
              <motion.div
                key="music"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Demo Notice */}
                <div className="bg-orange-500/20 border border-orange-400/30 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">⚠️</span>
                    </div>
                    <div>
                      <p className="text-orange-200 font-medium">CORS Issue Fixed</p>
                      <p className="text-orange-300 text-sm">
                        Using Google's test videos (no CORS restrictions) as audio sources. These will trigger the Web Audio API fallback to generate meditation tones. For production, use local audio files.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Current Track */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
                  <div className="flex items-center space-x-6 mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-r ${currentTracks[currentTrack]?.color || 'from-purple-400 to-pink-500'} rounded-3xl flex items-center justify-center shadow-xl`}>
                      <Music className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-2xl">{currentTracks[currentTrack]?.title || 'Loading...'}</h3>
                      <p className="text-purple-600 text-lg">{currentTracks[currentTrack]?.artist || 'Unknown Artist'}</p>
                      <p className="text-purple-400">{currentTracks[currentTrack]?.duration || '0:00'}</p>
                    </div>
                  </div>

                  {/* Audio Controls */}
                  <div className="space-y-6">
                    {/* Progress Bar */}
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full w-1/3"></div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-center space-x-6">
                      <button
                        onClick={previousTrack}
                        className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
                      >
                        <SkipBack className="w-6 h-6 text-gray-700" />
                      </button>
                      <button
                        onClick={togglePlayPause}
                        className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-3xl transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white" />}
                      </button>
                      <button
                        onClick={nextTrack}
                        className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
                      >
                        <SkipForward className="w-6 h-6 text-gray-700" />
                      </button>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={toggleMute}
                        className="p-3 hover:bg-white/10 rounded-xl transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5 text-gray-700" /> : <Volume2 className="w-5 h-5 text-gray-700" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="flex-1 h-3 bg-white/20 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Music Library */}
                <div className="space-y-4">
                  <h3 className="text-gray-800 font-bold text-2xl">Music Library</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                      <div className="col-span-full text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
                        <p className="text-purple-600 mt-4">Loading music...</p>
                      </div>
                    ) : (
                      currentTracks.map((track, index) => (
                        <motion.div
                          key={track.id}
                          onClick={() => setCurrentTrack(index)}
                          className={`p-6 rounded-3xl cursor-pointer transition-all duration-300 ${
                            index === currentTrack
                              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30'
                              : 'bg-white/90 hover:bg-white border border-white/30'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${track.color} rounded-2xl flex items-center justify-center`}>
                              <Music className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">{track.title}</h4>
                              <p className="text-purple-600 text-sm">{track.artist}</p>
                              <p className="text-purple-400 text-xs">{track.duration}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'videos' && (
              <motion.div
                key="videos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Demo Notice */}
                <div className="bg-green-500/20 border border-green-400/30 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🎬</span>
                    </div>
                    <div>
                      <p className="text-green-200 font-medium">Video Demo</p>
                      <p className="text-green-300 text-sm">
                        Using Google's test videos for demonstration. These videos should play properly and demonstrate the video player functionality.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Current Video */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
                  <div className="relative mb-6">
                    <video
                      ref={videoRef}
                      className="w-full h-64 bg-black rounded-3xl"
                      poster={currentVideos[currentVideo]?.thumbnail || ''}
                      onClick={toggleVideoPlayPause}
                    >
                      <source src={currentVideos[currentVideo]?.videoUrl || ''} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    
                    {/* Video Overlay Controls */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-3xl">
                      <button
                        onClick={toggleVideoPlayPause}
                        className="p-6 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm"
                      >
                        {isVideoPlaying ? <Pause className="w-10 h-10 text-white" /> : <Play className="w-10 h-10 text-white" />}
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 text-2xl">{currentVideos[currentVideo]?.title || 'Loading...'}</h3>
                    <p className="text-purple-600 text-lg">{currentVideos[currentVideo]?.instructor || 'Unknown Instructor'}</p>
                    <p className="text-purple-400">{currentVideos[currentVideo]?.duration || '0:00'}</p>
                  </div>

                  {/* Video Controls */}
                  <div className="flex items-center justify-center space-x-6">
                    <button
                      onClick={previousVideo}
                      className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
                    >
                      <SkipBack className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
                    >
                      {isFullscreen ? <Minimize2 className="w-6 h-6 text-gray-700" /> : <Maximize2 className="w-6 h-6 text-gray-700" />}
                    </button>
                    <button
                      onClick={nextVideo}
                      className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
                    >
                      <SkipForward className="w-6 h-6 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Video Library */}
                <div className="space-y-4">
                  <h3 className="text-gray-800 font-bold text-2xl">Meditation Videos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                      <div className="col-span-full text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
                        <p className="text-purple-600 mt-4">Loading videos...</p>
                      </div>
                    ) : (
                      currentVideos.map((video, index) => (
                        <motion.div
                          key={video.id}
                          onClick={() => setCurrentVideo(index)}
                          className={`p-6 rounded-3xl cursor-pointer transition-all duration-300 ${
                            index === currentVideo
                              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30'
                              : 'bg-white/90 hover:bg-white border border-white/30'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center space-x-4">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-20 h-16 rounded-2xl object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 text-sm">{video.title}</h4>
                              <p className="text-purple-600 text-xs">{video.instructor}</p>
                              <p className="text-purple-400 text-xs">{video.duration}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              {video.type === 'breathing' && <Wind className="w-5 h-5 text-blue-400" />}
                              {video.type === 'meditation' && <Moon className="w-5 h-5 text-purple-400" />}
                              {video.type === 'yoga' && <TreePine className="w-5 h-5 text-green-400" />}
                              {video.type === 'sleep' && <Sparkles className="w-5 h-5 text-pink-400" />}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onEnded={nextTrack}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            audioRef.current.volume = volume;
          }
        }}
        onError={(e) => {
          console.error('Audio loading error:', e);
          alert('Error loading audio file. The audio URL may be invalid or blocked by CORS.');
        }}
        onCanPlay={() => {
          console.log('Audio can play');
        }}
        crossOrigin="anonymous"
      />
    </div>
  );
};

export default Meditation;
