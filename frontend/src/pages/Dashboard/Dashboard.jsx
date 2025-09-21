import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import IntelligentMoodDetector from '../../services/intelligentMoodDetector';
import PassiveVoiceAnalysis from '../../services/passiveVoiceAnalysis';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Leaf, 
  Heart, 
  Wind, 
  Award,
  Plus,
  BarChart3,
  Clock,
  Sparkles,
  Star,
  Zap,
  Sun,
  Moon,
  Cloud,
  Droplets,
  Activity,
  Brain,
  Shield,
  Crown,
  Gem,
  Flame,
  Rainbow,
  Gamepad2,
  Bot,
  AlertTriangle
} from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import { taskAPI, journalAPI, moodAPI, plantAPI, breathingAPI, badgeAPI } from '../../services/api';
import MoodCalendar from '../../components/Features/MoodCalendar';
import HabitTracker from '../../components/Features/HabitTracker';
import MeditationTimer from '../../components/Features/MeditationTimer';
import AIAssistant from '../../components/AIAssistant/AIAssistant';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState({
    tasksCompleted: 0,
    journalEntries: 0,
    moodEntries: 0,
    breathingSessions: 0,
    plantLevel: 1,
    streak: 0,
    badges: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentJournal, setRecentJournal] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  // Intelligent Mood Detection State
  const [moodDetector] = useState(new IntelligentMoodDetector());
  const [passiveVoiceAnalysis] = useState(new PassiveVoiceAnalysis());
  const [currentMood, setCurrentMood] = useState('neutral');
  const [moodConfidence, setMoodConfidence] = useState(0);
  const [activeInterventions, setActiveInterventions] = useState([]);
  const [userBehavior, setUserBehavior] = useState({});

  useEffect(() => {
    fetchDashboardData();
    
    // Initialize intelligent mood detection
    initializeMoodDetection();
    
    // Track user behavior
    trackUserBehavior();
    
    // Listen for mood changes
    window.addEventListener('moodChange', handleMoodChange);
    
    return () => {
      window.removeEventListener('moodChange', handleMoodChange);
      passiveVoiceAnalysis.cleanup();
    };
  }, []);

  const fetchDashboardData = async () => {
    // Check if user is authenticated before making API calls
    if (!user || !isAuthenticated) {
      console.log('User not authenticated, skipping API calls');
      setIsLoading(false);
      return;
    }

    try {
      const [tasksRes, journalRes, moodRes, plantRes, breathingRes, badgesRes] = await Promise.all([
        taskAPI.getTasks().catch(() => ({ data: { data: [] } })),
        journalAPI.getEntries().catch(() => ({ data: { data: [] } })),
        moodAPI.getMoodHistory().catch(() => ({ data: { data: [] } })),
        plantAPI.getPlant().catch(() => ({ data: { data: { growthLevel: 1 } } })),
        breathingAPI.getSessions().catch(() => ({ data: { data: [] } })),
        badgeAPI.getBadges().catch(() => ({ data: { data: [] } }))
      ]);

      const tasks = tasksRes.data.data || [];
      const completedTasks = tasks.filter(task => task.isCompleted);
      
      setStats({
        tasksCompleted: completedTasks.length,
        journalEntries: journalRes.data.data?.length || 0,
        moodEntries: moodRes.data.data?.length || 0,
        breathingSessions: breathingRes.data.data?.length || 0,
        plantLevel: plantRes.data.data?.growthLevel || 1,
        streak: user?.currentStreak || 0,
        badges: badgesRes.data.data?.length || 0
      });

      setRecentTasks(tasks.slice(0, 3));
      setRecentJournal(journalRes.data.data?.slice(0, 2) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize intelligent mood detection
  const initializeMoodDetection = async () => {
    try {
      const initialized = await passiveVoiceAnalysis.initialize();
      if (initialized) {
        passiveVoiceAnalysis.startPassiveMonitoring();
        console.log('Intelligent mood detection initialized');
      }
    } catch (error) {
      console.log('Mood detection initialization failed:', error);
    }
  };

  // Track user behavior patterns
  const trackUserBehavior = () => {
    const behavior = {
      timeOnEmergency: 0,
      timeOnJournal: 0,
      timeOnMeditation: 0,
      timeOnPlant: 0,
      rapidClicks: 0,
      hesitationClicks: 0,
      erraticScrolling: false,
      slowScrolling: false,
      interactionFrequency: 0.5,
      taskCompletionRate: 0.5
    };

    // Track page time
    const startTime = Date.now();
    const trackPageTime = () => {
      const timeSpent = Date.now() - startTime;
      const currentPath = window.location.pathname;
      
      if (currentPath.includes('emergency')) behavior.timeOnEmergency += timeSpent;
      if (currentPath.includes('journal')) behavior.timeOnJournal += timeSpent;
      if (currentPath.includes('meditation')) behavior.timeOnMeditation += timeSpent;
      if (currentPath.includes('plant')) behavior.timeOnPlant += timeSpent;
    };

    // Track clicks
    let clickCount = 0;
    let lastClickTime = 0;
    
    const trackClicks = (e) => {
      const now = Date.now();
      if (now - lastClickTime < 200) {
        behavior.rapidClicks++;
      } else {
        behavior.hesitationClicks++;
      }
      lastClickTime = now;
      clickCount++;
    };

    // Track scrolling
    let scrollCount = 0;
    let lastScrollTime = 0;
    
    const trackScrolling = (e) => {
      const now = Date.now();
      if (now - lastScrollTime < 100) {
        behavior.erraticScrolling = true;
      }
      scrollCount++;
      lastScrollTime = now;
    };

    // Add event listeners
    document.addEventListener('click', trackClicks);
    document.addEventListener('scroll', trackScrolling);
    window.addEventListener('beforeunload', trackPageTime);

    // Update behavior state
    setUserBehavior(behavior);

    // Cleanup
    return () => {
      document.removeEventListener('click', trackClicks);
      document.removeEventListener('scroll', trackScrolling);
      window.removeEventListener('beforeunload', trackPageTime);
    };
  };

  // Handle mood change events
  const handleMoodChange = (event) => {
    const { mood, confidence, triggers, severity } = event.detail;
    
    setCurrentMood(mood);
    setMoodConfidence(confidence);
    
    // Generate interventions based on mood
    const interventions = moodDetector.generatePersonalizedInterventions({
      mood,
      confidence,
      triggers,
      severity
    });
    
    setActiveInterventions(interventions);
    
    console.log('Mood detected:', { mood, confidence, triggers, severity });
  };

  const quickActions = [
    {
      title: 'Write Journal',
      description: 'Express your thoughts',
      icon: Plus,
      color: 'bg-teal-500',
      glowColor: 'shadow-teal-500/25',
      link: '/journal'
    },
    {
      title: 'Add Task',
      description: 'Set a new goal',
      icon: Target,
      color: 'bg-teal-500',
      glowColor: 'shadow-teal-500/25',
      link: '/tasks'
    },
    {
      title: 'Track Mood',
      description: 'How are you feeling?',
      icon: Heart,
      color: 'bg-teal-500',
      glowColor: 'shadow-teal-500/25',
      link: '/mood'
    },
    {
      title: 'Breathing Exercise',
      description: 'Take a moment to breathe',
      icon: Wind,
      color: 'bg-teal-500',
      glowColor: 'shadow-teal-500/25',
      link: '/breathing'
    }
  ];

  const achievementCards = [
    {
      title: 'Daily Streak',
      value: stats.streak,
      icon: Flame,
      color: 'bg-teal-500',
      description: 'Days in a row'
    },
    {
      title: 'Total Points',
      value: user?.points || 0,
      icon: Star,
      color: 'bg-teal-500',
      description: 'Wellness points earned'
    },
    {
      title: 'Plant Growth',
      value: stats.plantLevel,
      icon: Leaf,
      color: 'bg-teal-500',
      description: 'Current level'
    },
    {
      title: 'Badges Earned',
      value: stats.badges,
      icon: Crown,
      color: 'bg-teal-500',
      description: 'Achievements unlocked'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div 
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-400 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-teal-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-teal-300/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300/30 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-300/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-teal-400 rounded-full opacity-60"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      <motion.div 
        className="relative space-y-8 p-6 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Hero Welcome Section */}
        <motion.div 
          className="relative overflow-hidden rounded-3xl bg-[#96e3d1] p-8 text-black shadow-2xl backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Enhanced Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-4 right-4 w-20 h-20 bg-white/20 rounded-full blur-xl"
              animate={{ 
                scale: [1, 1.3, 1], 
                opacity: [0.3, 0.7, 0.3],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-4 left-4 w-16 h-16 bg-white/20 rounded-full blur-xl"
              animate={{ 
                scale: [1.2, 1, 1.2], 
                opacity: [0.6, 0.3, 0.6],
                rotate: [360, 180, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/15 rounded-full blur-lg"
              animate={{ 
                y: [0, -20, 0],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            />
            <motion.div
              className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-white/25 rounded-full blur-md"
              animate={{ 
                x: [0, 15, 0],
                opacity: [0.5, 0.9, 0.5]
              }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 2 }}
            />
          </div>

          <div className="relative z-10">
            <motion.div
              className="flex items-center space-x-3 mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-4xl font-bold text-gray-600">
                  Welcome back, {user?.username}! 
                </p>
                <p className="text-black/90 text-lg font-medium">Ready to continue your wellness journey?</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-wrap items-center gap-6 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3">
                <TrendingUp className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">{user?.points || 0} Points</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3">
                <Calendar className="w-5 h-5 text-orange-300" />
                <span className="font-semibold">{stats.streak} Day Streak</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3">
                <Crown className="w-5 h-5 text-purple-300" />
                <span className="font-semibold">{stats.badges} Badges</span>
              </div>
            </motion.div>

            {/* Intelligent Mood Detection & Interventions */}
            {activeInterventions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-teal-500 rounded-2xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      💡 Personalized Support
                    </h3>
                    <p className="text-white/80 text-sm">
                      Detected mood: {currentMood.charAt(0).toUpperCase() + currentMood.slice(1)} 
                      ({Math.round(moodConfidence * 100)}% confidence)
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeInterventions.map((intervention, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-2">
                            {intervention.type.replace('_', ' ').toUpperCase()}
                          </h4>
                          <p className="text-white/80 text-sm mb-3">
                            {intervention.content}
                          </p>
                          <button className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 transition-all duration-200 hover:scale-105">
                            Try This
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Achievement Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {achievementCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:border-white/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.03, rotateY: 2 }}
              >
                <div className={`absolute inset-0 ${card.color.replace('bg-', 'bg-')}/10 group-hover:opacity-20 transition-opacity duration-300`} />
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-16 h-16 ${card.color} rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <motion.div
                      className="text-3xl font-bold text-gray-800"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {card.value}
                    </motion.div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{card.title}</h3>
                  <p className="text-sm text-gray-600">{card.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-teal-500 rounded-2xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={action.link}
                    className="group block p-6 bg-white/70 backdrop-blur-sm rounded-3xl border border-white/40 hover:border-white/60 transition-all duration-500 hover:shadow-2xl hover:bg-white/80"
                  >
                    <div className={`w-16 h-16 ${action.color} rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl ${action.glowColor}`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">{action.title}</h3>
                    <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">{action.description}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Activity Overview */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {/* Recent Tasks */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-500 rounded-2xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Recent Tasks</h2>
              </div>
              <Link 
                to="/tasks" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors"
              >
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              <AnimatePresence>
                {recentTasks.length > 0 ? (
                  recentTasks.map((task, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/70 transition-colors"
                    >
                      <div className={`w-4 h-4 rounded-full ${task.isCompleted ? 'bg-emerald-500' : 'bg-gray-300'} shadow-sm`}></div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {task.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{task.category}</p>
                      </div>
                      {task.isCompleted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center"
                        >
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-gray-500"
                  >
                    <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No recent tasks</p>
                    <p className="text-sm">Start by adding your first task!</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Recent Journal Entries */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Recent Journal</h2>
              </div>
              <Link 
                to="/journal" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors"
              >
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              <AnimatePresence>
                {recentJournal.length > 0 ? (
                  recentJournal.map((entry, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/70 transition-colors"
                    >
                      <p className="text-sm text-gray-800 line-clamp-2 mb-3">{entry.content}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </span>
                        {entry.mood && (
                          <motion.span 
                            className={`px-3 py-1 text-xs rounded-full font-medium ${
                              entry.mood === 'happy' ? 'bg-yellow-100 text-yellow-800' :
                              entry.mood === 'calm' ? 'bg-blue-100 text-blue-800' :
                              entry.mood === 'sad' ? 'bg-gray-100 text-gray-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                            whileHover={{ scale: 1.05 }}
                          >
                            {entry.mood}
                          </motion.span>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-gray-500"
                  >
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No recent journal entries</p>
                    <p className="text-sm">Start writing your thoughts!</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Games Section */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Wellness Games</h2>
                  <p className="text-gray-600 text-lg">Play fun games to boost your mood and retention</p>
                </div>
              </div>
              <Link 
                to="/games" 
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <Gamepad2 className="w-5 h-5" />
                <span>Play Games</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Featured Games */}
            <motion.div
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Mood Match</h3>
                  <p className="text-sm text-gray-600">Match emotions with activities</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Easy</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-semibold text-gray-800">50 pts</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Breathing Challenge</h3>
                  <p className="text-sm text-gray-600">Master breathing techniques</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">Medium</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-semibold text-gray-800">75 pts</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Memory Garden</h3>
                  <p className="text-sm text-gray-600">Grow your virtual garden</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">Hard</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-semibold text-gray-800">100 pts</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Wellness Tools Section */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Wellness Tools</h2>
                <p className="text-gray-600 text-lg">Advanced features to support your mental health journey</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mood Calendar */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
            >
              <MoodCalendar />
            </motion.div>

            {/* Habit Tracker */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 }}
            >
              <HabitTracker />
            </motion.div>

            {/* Meditation Timer */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 }}
            >
              <MeditationTimer />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* AI Assistant */}
      <AIAssistant 
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        onMinimize={() => setIsAIAssistantOpen(false)}
      />

         {/* Enhanced Floating AI Assistant Button */}
         <motion.button
           onClick={() => setIsAIAssistantOpen(true)}
           className="fixed bottom-8 right-24 w-20 h-20 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 flex items-center justify-center z-50 backdrop-blur-sm border border-white/20"
           whileHover={{ 
             scale: 1.15, 
             rotate: 5,
             boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)"
           }}
           whileTap={{ scale: 0.9 }}
           initial={{ opacity: 0, scale: 0, rotate: -180 }}
           animate={{ opacity: 1, scale: 1, rotate: 0 }}
           transition={{ 
             delay: 1.5,
             type: "spring",
             stiffness: 200,
             damping: 15
           }}
           title="Open AI Assistant - Drag to move around!"
         >
           <Bot className="w-10 h-10" />
           {/* Pulsing Ring Effect */}
           <motion.div
             className="absolute inset-0 rounded-full border-2 border-white/30"
             animate={{
               scale: [1, 1.3, 1],
               opacity: [0.7, 0, 0.7],
             }}
             transition={{
               duration: 2,
               repeat: Infinity,
               ease: "easeInOut"
             }}
           />
           {/* AI Assistant Label */}
           <motion.div
             className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-1 rounded-lg opacity-0 pointer-events-none whitespace-nowrap"
             animate={{
               opacity: [0, 1, 0],
               y: [0, -3, 0]
             }}
             transition={{
               duration: 4,
               repeat: Infinity,
               ease: "easeInOut",
               delay: 3
             }}
           >
             AI Assistant
           </motion.div>
         </motion.button>

         {/* Emergency Services Button */}
         <motion.button
           onClick={() => window.location.href = '/emergency'}
           className="fixed bottom-8 left-8 w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 flex items-center justify-center z-50 backdrop-blur-sm border border-white/20"
           whileHover={{ 
             scale: 1.15, 
             rotate: -5,
             boxShadow: "0 0 30px rgba(239, 68, 68, 0.6)"
           }}
           whileTap={{ scale: 0.9 }}
           initial={{ opacity: 0, scale: 0, rotate: 180 }}
           animate={{ opacity: 1, scale: 1, rotate: 0 }}
           transition={{ 
             delay: 2,
             type: "spring",
             stiffness: 200,
             damping: 15
           }}
           title="Emergency Services - Crisis Support"
         >
           <AlertTriangle className="w-8 h-8" />
           {/* Pulsing Ring Effect */}
           <motion.div
             className="absolute inset-0 rounded-full border-2 border-red-300"
             animate={{
               scale: [1, 1.4, 1],
               opacity: [0.7, 0, 0.7],
             }}
             transition={{
               duration: 2,
               repeat: Infinity,
               ease: "easeInOut"
             }}
           />
           {/* Emergency Label */}
           <motion.div
             className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-3 py-1 rounded-lg opacity-0 pointer-events-none whitespace-nowrap"
             animate={{
               opacity: [0, 1, 0],
               y: [0, -3, 0]
             }}
             transition={{
               duration: 4,
               repeat: Infinity,
               ease: "easeInOut",
               delay: 3
             }}
           >
             Emergency
           </motion.div>
         </motion.button>
    </div>
  );
};

export default Dashboard;
