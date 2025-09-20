import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../../components/Icons/IconSystem';
import { journalAPI } from '../../services/api';
import VoiceRecorder from '../../components/VoiceRecorder/VoiceRecorder';
import AdvancedVoiceRecorder from '../../components/VoiceRecorder/AdvancedVoiceRecorder';
import toast from 'react-hot-toast';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('write');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState('all');
  const [showPrompts, setShowPrompts] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [writingStreak, setWritingStreak] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(100);
  const [todayWordCount, setTodayWordCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  // Journal prompts for inspiration
  const journalPrompts = [
    "What are three things you're grateful for today?",
    "Describe a moment that made you smile today.",
    "What challenge did you overcome recently?",
    "How did you show kindness to yourself or others today?",
    "What would you tell your past self from a year ago?",
    "Describe your ideal day in detail.",
    "What's something new you learned this week?",
    "How have you grown as a person recently?",
    "What brings you the most peace and calm?",
    "Describe a dream you had recently.",
    "What's one thing you'd like to improve about yourself?",
    "How do you want to feel at the end of this year?"
  ];

  // Journal templates
  const journalTemplates = [
    {
      id: 'gratitude',
      name: 'Gratitude Journal',
      icon: 'star',
      color: 'emerald',
      content: 'Today I am grateful for:\n\n1. \n2. \n3. \n\nWhy these things matter to me:\n\n'
    },
    {
      id: 'reflection',
      name: 'Daily Reflection',
      icon: 'brain',
      color: 'sky',
      content: 'Today\'s highlights:\n\nChallenges I faced:\n\nWhat I learned:\n\nHow I can improve tomorrow:\n\n'
    },
    {
      id: 'mood',
      name: 'Mood Check-in',
      icon: 'heart',
      color: 'lavender',
      content: 'Current mood: \n\nWhat\'s contributing to this mood:\n\nWhat I need right now:\n\nHow I can support myself:\n\n'
    },
    {
      id: 'goals',
      name: 'Goal Progress',
      icon: 'trending',
      color: 'emerald',
      content: 'Goal I worked on today:\n\nProgress made:\n\nObstacles encountered:\n\nNext steps:\n\n'
    }
  ];

  useEffect(() => {
    checkConnection();
    fetchEntries();
    calculateWritingStreak();
    calculateTodayWordCount();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const checkConnection = async () => {
    try {
      // Test with a simple endpoint that doesn't require auth
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test', password: 'test' }),
        credentials: 'include'
      });
      
      // Even if login fails, if we get a response, the server is connected
      if (response.status === 400 || response.status === 401) {
        setConnectionStatus('connected');
      } else if (response.ok) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      console.error('Connection check failed:', error);
      setConnectionStatus('disconnected');
    }
  };

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const response = await journalAPI.getEntries();
      setEntries(response.data.data || []);
    } catch (error) {
      console.error('Journal fetch error:', error);
      toast.error('Failed to fetch journal entries');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateWritingStreak = () => {
    // Calculate consecutive days of writing
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    for (let i = 0; i < 30; i++) {
      const dateStr = currentDate.toDateString();
      const hasEntry = entries.some(entry => 
        new Date(entry.createdAt).toDateString() === dateStr
      );
      
      if (hasEntry) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    setWritingStreak(streak);
  };

  const calculateTodayWordCount = () => {
    const today = new Date().toDateString();
    const todayEntries = entries.filter(entry => 
      new Date(entry.createdAt).toDateString() === today
    );
    
    const totalWords = todayEntries.reduce((count, entry) => {
      return count + entry.content.split(/\s+/).filter(word => word.length > 0).length;
    }, 0);
    
    setTodayWordCount(totalWords);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting journal entry:', data.content);
      console.log('API URL:', import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1');
      
      const response = await journalAPI.createEntry(data.content);
      console.log('Journal entry response:', response);
      const newEntry = response.data.data;
      setEntries(prev => [newEntry, ...prev]);
      reset();
      setSelectedTemplate(null);
      calculateWritingStreak();
      calculateTodayWordCount();
      
      // Check if daily goal is reached
      const newWordCount = todayWordCount + data.content.split(/\s+/).filter(word => word.length > 0).length;
      if (newWordCount >= dailyGoal) {
        toast.success('🎉 Daily writing goal achieved!', { duration: 4000 });
      } else {
        toast.success('✨ Journal entry saved successfully!');
      }
    } catch (error) {
      console.error('Journal save error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Network error:', error.message);
      
      let errorMessage = 'Failed to save journal entry. Please try again.';
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Please log in again to continue.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Invalid data. Please check your entry.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'happy': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'calm': return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'sad': return 'bg-stone-100 text-stone-800 border-stone-200';
      case 'anxious': return 'bg-lavender-100 text-lavender-800 border-lavender-200';
      case 'angry': return 'bg-red-100 text-red-800 border-red-200';
      case 'neutral': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'happy': return 'smile';
      case 'calm': return 'moon';
      case 'sad': return 'frown';
      case 'anxious': return 'exclamationTriangle';
      case 'angry': return 'angry';
      case 'neutral': return 'meh';
      default: return 'meh';
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = selectedMood === 'all' || entry.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  const handleTemplateSelect = (template) => {
    setValue('content', template.content);
    setSelectedTemplate(template);
    setShowPrompts(false);
  };

  const handlePromptSelect = (prompt) => {
    setValue('content', prompt);
    setShowPrompts(false);
  };

  const handleVoiceMoodAnalysis = (mood, details) => {
    // You can use the detected mood to pre-fill or suggest content
    console.log('Voice mood detected:', mood, details);
    
    // Optionally add a note about voice analysis to the journal entry
    const voiceNote = `\n\n[Voice analysis detected: ${mood} mood]`;
    const currentContent = watch('content') || '';
    setValue('content', currentContent + voiceNote);
  };

  const content = watch('content') || '';
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  const progressPercentage = Math.min((todayWordCount / dailyGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-wellness-primary">
      <motion.div 
        className="max-w-6xl mx-auto px-6 py-8 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Enhanced Header with Stats */}
        <motion.div 
          className="text-center space-y-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
            <Icon name="journal" size="lg" className="text-emerald-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-wellness-primary mb-2">
              Journal
            </h1>
            <p className="text-wellness-secondary max-w-xl mx-auto">
              Express your thoughts and feelings in a safe, private space
            </p>
            {/* Connection Status */}
            <div className="flex items-center justify-center space-x-2 mt-4">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-emerald-400' :
                connectionStatus === 'disconnected' ? 'bg-red-400' :
                'bg-yellow-400'
              }`}></div>
              <span className="text-xs text-wellness-muted">
                {connectionStatus === 'connected' ? 'Connected to server' :
                 connectionStatus === 'disconnected' ? 'Server disconnected' :
                 'Checking connection...'}
              </span>
            </div>
          </div>

          {/* Writing Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <motion.div 
              className="wellness-card p-4 text-center"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Icon name="trending" size="sm" className="text-emerald-500" />
                <span className="text-sm font-medium text-wellness-secondary">Writing Streak</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600">{writingStreak} days</div>
            </motion.div>

            <motion.div 
              className="wellness-card p-4 text-center"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Icon name="pen" size="sm" className="text-sky-500" />
                <span className="text-sm font-medium text-wellness-secondary">Today's Words</span>
              </div>
              <div className="text-2xl font-bold text-sky-600">{todayWordCount}</div>
            </motion.div>

            <motion.div 
              className="wellness-card p-4 text-center"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Icon name="star" size="sm" className="text-lavender-500" />
                <span className="text-sm font-medium text-wellness-secondary">Daily Goal</span>
              </div>
              <div className="text-2xl font-bold text-lavender-600">{dailyGoal}</div>
            </motion.div>
          </div>

          {/* Daily Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-wellness-muted mb-2">
              <span>Daily Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className="flex space-x-1 bg-white/20 backdrop-blur-sm rounded-xl p-1 max-w-md mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { id: 'write', label: 'Write', icon: 'pen' },
            { id: 'entries', label: 'Entries', icon: 'journal' },
            { id: 'insights', label: 'Insights', icon: 'brain' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-wellness-muted hover:text-wellness-primary'
              }`}
            >
              <Icon name={tab.icon} size="sm" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Write Tab */}
        {activeTab === 'write' && (
          <motion.div 
            className="wellness-card p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-wellness-primary mb-1">New Entry</h2>
                <p className="text-wellness-secondary text-sm">Share what's on your mind</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-wellness-muted mb-1">Current time</div>
                <div className="text-sm font-mono font-medium text-wellness-primary">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>

            {/* Templates and Prompts */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setShowPrompts(!showPrompts)}
                className="flex items-center space-x-2 px-3 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors"
              >
                <Icon name="sparkles" size="sm" />
                <span className="text-sm font-medium">Prompts</span>
              </button>
              
              {journalTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    selectedTemplate?.id === template.id
                      ? `bg-${template.color}-200 text-${template.color}-800`
                      : `bg-${template.color}-100 text-${template.color}-700 hover:bg-${template.color}-200`
                  }`}
                >
                  <Icon name={template.icon} size="sm" />
                  <span className="text-sm font-medium">{template.name}</span>
                </button>
              ))}
            </div>

            {/* Prompts Dropdown */}
            <AnimatePresence>
              {showPrompts && (
                <motion.div 
                  className="mb-6 p-4 bg-sky-50 rounded-xl border border-sky-200"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <h3 className="text-sm font-semibold text-sky-800 mb-3">Writing Prompts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {journalPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handlePromptSelect(prompt)}
                        className="text-left p-3 text-sm text-sky-700 hover:bg-sky-100 rounded-lg transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Advanced Voice Recording Section */}
            <AdvancedVoiceRecorder 
              onMoodAnalysis={handleVoiceMoodAnalysis}
              className="mb-6"
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="relative">
                <textarea
                  {...register('content', { 
                    required: 'Please write something',
                    minLength: {
                      value: 10,
                      message: 'Entry must be at least 10 characters long'
                    }
                  })}
                  rows={8}
                  className="wellness-input w-full resize-none text-wellness-primary placeholder-wellness-muted"
                  placeholder="What's on your mind today? Share your thoughts, feelings, or experiences..."
                />
                {errors.content && (
                  <motion.p 
                    className="text-red-500 text-sm mt-2 flex items-center space-x-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Icon name="warning" size="sm" />
                    <span>{errors.content.message}</span>
                  </motion.p>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-wellness-muted">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span>{wordCount} words</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-wellness-muted">
                    <Icon name="brain" size="sm" className="text-lavender-500" />
                    <span>AI analysis enabled</span>
                  </div>
                </div>
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  className="wellness-button flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <Icon name="loading" size="sm" className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="send" size="sm" />
                      <span>Save Entry</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Entries Tab */}
        {activeTab === 'entries' && (
          <motion.div 
            className="wellness-card p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-wellness-primary mb-1">Your Entries</h2>
                <p className="text-wellness-secondary text-sm">A collection of your thoughts</p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-wellness-muted bg-sage-100 px-3 py-1 rounded-full">
                <Icon name="trending" size="sm" className="text-emerald-500" />
                <span className="font-medium">{filteredEntries.length} entries</span>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Icon name="search" size="sm" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-wellness-muted" />
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="wellness-input w-full pl-10"
                />
              </div>
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="wellness-input"
              >
                <option value="all">All Moods</option>
                <option value="happy">Happy</option>
                <option value="calm">Calm</option>
                <option value="sad">Sad</option>
                <option value="anxious">Anxious</option>
                <option value="angry">Angry</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>

            <AnimatePresence>
              {isLoading ? (
                <motion.div 
                  className="flex items-center justify-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center space-x-3">
                    <Icon name="loading" size="lg" className="animate-spin text-emerald-500" />
                    <span className="text-wellness-secondary font-medium">Loading your entries...</span>
                  </div>
                </motion.div>
              ) : filteredEntries.length > 0 ? (
                <div className="space-y-4">
                  {filteredEntries.map((entry, index) => (
                    <motion.div 
                      key={entry._id} 
                      className="bg-white rounded-xl p-6 border border-sage-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -1 }}
                    >
                      {/* Entry Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2 text-sm text-wellness-muted">
                            <Icon name="calendar" size="sm" className="text-sky-500" />
                            <span className="font-medium">
                              {new Date(entry.createdAt).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-wellness-muted">
                            <Icon name="clock" size="sm" className="text-emerald-500" />
                            <span>
                              {new Date(entry.createdAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                        
                        {entry.mood && (
                          <motion.div 
                            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getMoodColor(entry.mood)}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <Icon name={getMoodIcon(entry.mood)} size="sm" />
                            <span>{entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}</span>
                          </motion.div>
                        )}
                      </div>
                      
                      {/* Entry Content */}
                      <div className="prose prose-sm max-w-none mb-4">
                        <p className="text-wellness-primary leading-relaxed whitespace-pre-wrap">
                          {entry.content}
                        </p>
                      </div>
                      
                      {/* Mood Analysis */}
                      {entry.mood && (
                        <motion.div 
                          className="flex items-center space-x-2 text-sm text-wellness-muted bg-sky-50 px-3 py-2 rounded-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Icon name="brain" size="sm" className="text-lavender-500" />
                          <span>AI detected: <strong>{entry.mood}</strong> mood</span>
                        </motion.div>
                      )}

                      {/* CBT Analysis */}
                      {entry.cbtAnalysis && (
                        <motion.div 
                          className="mt-3 bg-gradient-to-r from-emerald-50 to-sky-50 rounded-lg p-4 border border-emerald-200"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <Icon name="brain" size="sm" className="text-emerald-600" />
                            <span className="text-sm font-semibold text-emerald-800">Cognitive Analysis</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-emerald-700">
                                <strong>Detected Pattern:</strong> {entry.cbtAnalysis.distortion}
                              </span>
                              <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                                {Math.round(entry.cbtAnalysis.confidence * 100)}% confidence
                              </span>
                            </div>
                            <div className="text-xs text-emerald-600">
                              Source: {entry.cbtAnalysis.source}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-sage-100 rounded-2xl mb-4">
                    <Icon name="journal" size="lg" className="text-sage-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-wellness-secondary mb-2">Start Writing</h3>
                  <p className="text-wellness-muted max-w-sm mx-auto">
                    Begin your wellness journey by documenting your thoughts and emotions.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <motion.div 
            className="wellness-card p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-wellness-primary mb-1">Writing Insights</h2>
              <p className="text-wellness-secondary text-sm">Discover patterns in your journaling</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mood Distribution */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-emerald-800 mb-4">Mood Distribution</h3>
                <div className="space-y-3">
                  {['happy', 'calm', 'neutral', 'sad', 'anxious', 'angry'].map((mood) => {
                    const count = entries.filter(entry => entry.mood === mood).length;
                    const percentage = entries.length > 0 ? (count / entries.length) * 100 : 0;
                    return (
                      <div key={mood} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon name={getMoodIcon(mood)} size="sm" className="text-emerald-600" />
                          <span className="text-sm font-medium text-emerald-700 capitalize">{mood}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-emerald-200 rounded-full h-2">
                            <div 
                              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-emerald-600 font-medium">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CBT Distortion Analysis */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">Cognitive Patterns</h3>
                <div className="space-y-3">
                  {(() => {
                    const distortions = {};
                    entries.forEach(entry => {
                      if (entry.cbtAnalysis && entry.cbtAnalysis.distortion) {
                        const distortion = entry.cbtAnalysis.distortion;
                        distortions[distortion] = (distortions[distortion] || 0) + 1;
                      }
                    });
                    
                    const sortedDistortions = Object.entries(distortions)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 6);
                    
                    if (sortedDistortions.length === 0) {
                      return (
                        <div className="text-center text-purple-600 text-sm py-4">
                          <Icon name="brain" size="lg" className="mx-auto mb-2" />
                          <p>No cognitive patterns detected yet.</p>
                          <p className="text-xs mt-1">Keep journaling to see insights!</p>
                        </div>
                      );
                    }
                    
                    return sortedDistortions.map(([distortion, count]) => {
                      const percentage = entries.length > 0 ? (count / entries.length) * 100 : 0;
                      return (
                        <div key={distortion} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Icon name="brain" size="sm" className="text-purple-600" />
                            <span className="text-sm font-medium text-purple-700">{distortion}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-purple-200 rounded-full h-2">
                              <div 
                                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-purple-600 font-medium">{count}</span>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Writing Statistics */}
              <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-sky-800 mb-4">Writing Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-sky-700">Total Entries</span>
                    <span className="text-lg font-bold text-sky-800">{entries.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-sky-700">Total Words</span>
                    <span className="text-lg font-bold text-sky-800">
                      {entries.reduce((count, entry) => count + entry.content.split(/\s+/).filter(word => word.length > 0).length, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-sky-700">Average Words/Entry</span>
                    <span className="text-lg font-bold text-sky-800">
                      {entries.length > 0 ? Math.round(entries.reduce((count, entry) => count + entry.content.split(/\s+/).filter(word => word.length > 0).length, 0) / entries.length) : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-sky-700">Current Streak</span>
                    <span className="text-lg font-bold text-sky-800">{writingStreak} days</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Journal;