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
  X,
  Maximize2,
  Minimize2,
  RotateCcw,
  Settings
} from 'lucide-react';
import MeditationAPI from '../../services/meditationService';

const MeditationMusicSidebar = ({ isOpen, onClose }) => {
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

  // Fetch meditation data from API
  useEffect(() => {
    const fetchMeditationData = async () => {
      if (!isOpen) return;
      
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
  }, [isOpen]);

  // Fallback data if API fails
  const fallbackMusicTracks = [
    {
      id: 1,
      title: "Ocean Waves",
      artist: "Nature Sounds",
      duration: "10:00",
      type: "nature",
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder - replace with actual soothing music
      color: "from-blue-400 to-cyan-500"
    },
    {
      id: 2,
      title: "Forest Rain",
      artist: "Ambient Nature",
      duration: "15:00",
      type: "nature",
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      color: "from-green-400 to-emerald-500"
    },
    {
      id: 3,
      title: "Zen Meditation",
      artist: "Peaceful Sounds",
      duration: "20:00",
      type: "meditation",
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      color: "from-purple-400 to-violet-500"
    },
    {
      id: 4,
      title: "Mountain Breeze",
      artist: "Calm Nature",
      duration: "12:00",
      type: "nature",
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      color: "from-indigo-400 to-blue-500"
    },
    {
      id: 5,
      title: "Inner Peace",
      artist: "Meditation Music",
      duration: "25:00",
      type: "meditation",
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
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
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      type: "breathing"
    },
    {
      id: 2,
      title: "Morning Meditation",
      instructor: "Zen Master Lee",
      duration: "10:15",
      thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      type: "meditation"
    },
    {
      id: 3,
      title: "Stress Relief Yoga",
      instructor: "Yoga Instructor Maya",
      duration: "15:45",
      thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      type: "yoga"
    },
    {
      id: 4,
      title: "Sleep Meditation",
      instructor: "Sleep Expert Alex",
      duration: "20:00",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop",
      videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      type: "sleep"
    }
  ];

  // Use API data or fallback data
  const currentTracks = musicTracks.length > 0 ? musicTracks : fallbackMusicTracks;
  const currentVideos = meditationVideos.length > 0 ? meditationVideos : fallbackMeditationVideos;

  // Audio Controls
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    const next = (currentTrack + 1) % musicTracks.length;
    setCurrentTrack(next);
    if (isPlaying) {
      audioRef.current?.play();
    }
  };

  const previousTrack = () => {
    const prev = currentTrack === 0 ? musicTracks.length - 1 : currentTrack - 1;
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
  const toggleVideoPlayPause = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const nextVideo = () => {
    const next = (currentVideo + 1) % meditationVideos.length;
    setCurrentVideo(next);
    setIsVideoPlaying(false);
  };

  const previousVideo = () => {
    const prev = currentVideo === 0 ? meditationVideos.length - 1 : currentVideo - 1;
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 h-full w-96 bg-gradient-to-b from-slate-900 via-purple-900 to-indigo-900 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 overflow-hidden"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        {/* Header */}
        <div className="relative z-10 p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Meditation & Music</h2>
                <p className="text-purple-200 text-sm">Find your inner peace</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('music')}
              className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'music'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white/10 text-purple-200 hover:bg-white/20'
              }`}
            >
              <Music className="w-4 h-4 inline mr-2" />
              Music
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'videos'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white/10 text-purple-200 hover:bg-white/20'
              }`}
            >
              <Video className="w-4 h-4 inline mr-2" />
              Videos
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'music' && (
              <motion.div
                key="music"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Current Track */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${currentTracks[currentTrack]?.color || 'from-purple-400 to-pink-500'} rounded-2xl flex items-center justify-center shadow-xl`}>
                      <Music className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg">{currentTracks[currentTrack]?.title || 'Loading...'}</h3>
                      <p className="text-purple-200">{currentTracks[currentTrack]?.artist || 'Unknown Artist'}</p>
                      <p className="text-purple-300 text-sm">{currentTracks[currentTrack]?.duration || '0:00'}</p>
                    </div>
                  </div>

                  {/* Audio Controls */}
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full w-1/3"></div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-center space-x-4">
                      <button
                        onClick={previousTrack}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                      >
                        <SkipBack className="w-5 h-5 text-white" />
                      </button>
                      <button
                        onClick={togglePlayPause}
                        className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
                      </button>
                      <button
                        onClick={nextTrack}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                      >
                        <SkipForward className="w-5 h-5 text-white" />
                      </button>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={toggleMute}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Music Library */}
                <div className="space-y-3">
                  <h3 className="text-white font-bold text-lg">Music Library</h3>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
                      <p className="text-purple-200 mt-2">Loading music...</p>
                    </div>
                  ) : (
                    currentTracks.map((track, index) => (
                    <motion.div
                      key={track.id}
                      onClick={() => setCurrentTrack(index)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                        index === currentTrack
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-r ${track.color} rounded-xl flex items-center justify-center`}>
                          <Music className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{track.title}</h4>
                          <p className="text-purple-200 text-sm">{track.artist}</p>
                        </div>
                        <span className="text-purple-300 text-sm">{track.duration}</span>
                      </div>
                    </motion.div>
                  ))
                  )}
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
                className="space-y-6"
              >
                {/* Current Video */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
                  <div className="relative mb-4">
                    <video
                      ref={videoRef}
                      className="w-full h-48 bg-black rounded-2xl"
                      poster={currentVideos[currentVideo]?.thumbnail || ''}
                      onClick={toggleVideoPlayPause}
                    >
                      <source src={currentVideos[currentVideo]?.videoUrl || ''} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    
                    {/* Video Overlay Controls */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
                      <button
                        onClick={toggleVideoPlayPause}
                        className="p-4 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm"
                      >
                        {isVideoPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white" />}
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-bold text-white text-lg">{currentVideos[currentVideo]?.title || 'Loading...'}</h3>
                    <p className="text-purple-200">{currentVideos[currentVideo]?.instructor || 'Unknown Instructor'}</p>
                    <p className="text-purple-300 text-sm">{currentVideos[currentVideo]?.duration || '0:00'}</p>
                  </div>

                  {/* Video Controls */}
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={previousVideo}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                    >
                      <SkipBack className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                    >
                      {isFullscreen ? <Minimize2 className="w-5 h-5 text-white" /> : <Maximize2 className="w-5 h-5 text-white" />}
                    </button>
                    <button
                      onClick={nextVideo}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                    >
                      <SkipForward className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Video Library */}
                <div className="space-y-3">
                  <h3 className="text-white font-bold text-lg">Meditation Videos</h3>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
                      <p className="text-purple-200 mt-2">Loading videos...</p>
                    </div>
                  ) : (
                    currentVideos.map((video, index) => (
                    <motion.div
                      key={video.id}
                      onClick={() => setCurrentVideo(index)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                        index === currentVideo
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-16 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-sm">{video.title}</h4>
                          <p className="text-purple-200 text-xs">{video.instructor}</p>
                          <p className="text-purple-300 text-xs">{video.duration}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {video.type === 'breathing' && <Wind className="w-4 h-4 text-blue-400" />}
                          {video.type === 'meditation' && <Moon className="w-4 h-4 text-purple-400" />}
                          {video.type === 'yoga' && <TreePine className="w-4 h-4 text-green-400" />}
                          {video.type === 'sleep' && <Sparkles className="w-4 h-4 text-pink-400" />}
                        </div>
                      </div>
                    </motion.div>
                  ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default MeditationMusicSidebar;
