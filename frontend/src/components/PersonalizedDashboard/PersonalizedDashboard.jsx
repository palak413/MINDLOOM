import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Brain, 
  Leaf, 
  Music, 
  BookOpen, 
  Zap, 
  Shield, 
  Sparkles,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';
import IntelligentMoodDetector from '../services/intelligentMoodDetector';

const PersonalizedDashboard = () => {
  const [moodDetector] = useState(new IntelligentMoodDetector());
  const [currentMood, setCurrentMood] = useState('neutral');
  const [moodConfidence, setMoodConfidence] = useState(0);
  const [activeInterventions, setActiveInterventions] = useState([]);
  const [dashboardConfig, setDashboardConfig] = useState({});
  const [userBehavior, setUserBehavior] = useState({});

  // Track user behavior patterns
  useEffect(() => {
    const trackBehavior = () => {
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

      // Cleanup
      return () => {
        document.removeEventListener('click', trackClicks);
        document.removeEventListener('scroll', trackScrolling);
        window.removeEventListener('beforeunload', trackPageTime);
      };
    };

    const cleanup = trackBehavior();
    return cleanup;
  }, []);

  // Analyze mood and update dashboard
  useEffect(() => {
    const analyzeMood = () => {
      // Analyze behavior patterns
      const behaviorMood = moodDetector.analyzeBehaviorPatterns(userBehavior);
      
      // Update mood state
      setCurrentMood(behaviorMood.mood);
      setMoodConfidence(behaviorMood.confidence);
      
      // Generate interventions
      const interventions = moodDetector.generatePersonalizedInterventions(behaviorMood);
      setActiveInterventions(interventions);
      
      // Update dashboard configuration
      const config = moodDetector.updateDashboardForMood(behaviorMood);
      setDashboardConfig(config);
    };

    analyzeMood();
  }, [userBehavior, moodDetector]);

  // Get mood-based styling
  const getMoodStyling = () => {
    const styles = {
      low: {
        background: 'bg-gradient-to-br from-orange-100 to-red-100',
        accent: 'text-orange-600',
        border: 'border-orange-200',
        button: 'bg-orange-500 hover:bg-orange-600'
      },
      anxious: {
        background: 'bg-gradient-to-br from-blue-100 to-indigo-100',
        accent: 'text-blue-600',
        border: 'border-blue-200',
        button: 'bg-blue-500 hover:bg-blue-600'
      },
      withdrawn: {
        background: 'bg-gradient-to-br from-green-100 to-emerald-100',
        accent: 'text-green-600',
        border: 'border-green-200',
        button: 'bg-green-500 hover:bg-green-600'
      },
      neutral: {
        background: 'bg-gradient-to-br from-purple-100 to-pink-100',
        accent: 'text-purple-600',
        border: 'border-purple-200',
        button: 'bg-purple-500 hover:bg-purple-600'
      }
    };
    
    return styles[currentMood] || styles.neutral;
  };

  const moodStyling = getMoodStyling();

  // Render intervention cards
  const renderInterventions = () => {
    return activeInterventions.map((intervention, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`p-4 rounded-xl border-2 ${moodStyling.border} ${moodStyling.background} backdrop-blur-sm`}
      >
        <div className="flex items-center space-x-3 mb-2">
          <div className={`w-8 h-8 rounded-full ${moodStyling.button} flex items-center justify-center`}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className={`font-semibold ${moodStyling.accent}`}>
            {intervention.type.replace('_', ' ').toUpperCase()}
          </h3>
        </div>
        <p className="text-gray-700 mb-3">{intervention.content}</p>
        <button className={`px-4 py-2 rounded-lg text-white ${moodStyling.button} transition-all duration-200 hover:scale-105`}>
          Try This
        </button>
      </motion.div>
    ));
  };

  // Render mood-aware features
  const renderMoodAwareFeatures = () => {
    const features = [
      {
        id: 'breathing',
        icon: Heart,
        title: 'Breathing Exercise',
        description: 'Gentle breathing to help you feel better',
        priority: dashboardConfig.highlightedFeatures?.includes('breathing') ? 'high' : 'normal'
      },
      {
        id: 'meditation',
        icon: Brain,
        title: 'Meditation',
        description: 'Calm your mind with guided meditation',
        priority: dashboardConfig.highlightedFeatures?.includes('meditation') ? 'high' : 'normal'
      },
      {
        id: 'plant_care',
        icon: Leaf,
        title: 'Plant Care',
        description: 'Nurture your virtual plant',
        priority: dashboardConfig.highlightedFeatures?.includes('plant_care') ? 'high' : 'normal'
      },
      {
        id: 'music',
        icon: Music,
        title: 'Calm Music',
        description: 'Soothing sounds for relaxation',
        priority: dashboardConfig.highlightedFeatures?.includes('calm_music') ? 'high' : 'normal'
      },
      {
        id: 'journal',
        icon: BookOpen,
        title: 'Journal',
        description: 'Express your thoughts and feelings',
        priority: dashboardConfig.highlightedFeatures?.includes('journaling') ? 'high' : 'normal'
      },
      {
        id: 'emergency',
        icon: Shield,
        title: 'Emergency Support',
        description: 'Crisis support and resources',
        priority: dashboardConfig.highlightedFeatures?.includes('emergency_services') ? 'high' : 'normal'
      }
    ];

    return features.map((feature) => {
      if (dashboardConfig.hiddenFeatures?.includes(feature.id)) return null;
      
      return (
        <motion.div
          key={feature.id}
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-xl border-2 ${moodStyling.border} ${moodStyling.background} backdrop-blur-sm cursor-pointer transition-all duration-200 ${
            feature.priority === 'high' ? 'ring-2 ring-opacity-50' : ''
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full ${moodStyling.button} flex items-center justify-center`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className={`font-semibold ${moodStyling.accent}`}>{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          </div>
        </motion.div>
      );
    });
  };

  return (
    <div className={`min-h-screen ${moodStyling.background} transition-all duration-500`}>
      <div className="container mx-auto px-4 py-8">
        {/* Mood Status Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className={`text-4xl font-bold ${moodStyling.accent} mb-2`}>
            Your Personalized Wellness Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            I'm here to help you feel better, one step at a time
          </p>
          
          {/* Mood Indicator */}
          <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm">
            <div className={`w-3 h-3 rounded-full ${moodStyling.button}`}></div>
            <span className={`font-medium ${moodStyling.accent}`}>
              Detected Mood: {currentMood.charAt(0).toUpperCase() + currentMood.slice(1)}
            </span>
            <span className="text-gray-500">
              ({Math.round(moodConfidence * 100)}% confidence)
            </span>
          </div>
        </motion.div>

        {/* Active Interventions */}
        {activeInterventions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className={`text-2xl font-bold ${moodStyling.accent} mb-4`}>
              💡 Personalized Suggestions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderInterventions()}
            </div>
          </motion.div>
        )}

        {/* Mood-Aware Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className={`text-2xl font-bold ${moodStyling.accent} mb-4`}>
            🌟 Wellness Activities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderMoodAwareFeatures()}
          </div>
        </motion.div>

        {/* Mood Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-6 rounded-xl bg-white/30 backdrop-blur-sm border border-white/20"
        >
          <h3 className={`text-xl font-bold ${moodStyling.accent} mb-4`}>
            📊 Your Wellness Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <TrendingUp className={`w-8 h-8 ${moodStyling.accent} mx-auto mb-2`} />
              <p className="text-gray-600">Mood Trend</p>
              <p className={`font-semibold ${moodStyling.accent}`}>
                {currentMood === 'low' ? 'Needs Support' : 
                 currentMood === 'anxious' ? 'Needs Calm' : 
                 currentMood === 'withdrawn' ? 'Needs Engagement' : 'Balanced'}
              </p>
            </div>
            <div className="text-center">
              <Clock className={`w-8 h-8 ${moodStyling.accent} mx-auto mb-2`} />
              <p className="text-gray-600">Activity Level</p>
              <p className={`font-semibold ${moodStyling.accent}`}>
                {userBehavior.interactionFrequency > 0.7 ? 'High' : 
                 userBehavior.interactionFrequency > 0.3 ? 'Medium' : 'Low'}
              </p>
            </div>
            <div className="text-center">
              <Target className={`w-8 h-8 ${moodStyling.accent} mx-auto mb-2`} />
              <p className="text-gray-600">Focus Area</p>
              <p className={`font-semibold ${moodStyling.accent}`}>
                {currentMood === 'low' ? 'Emotional Support' : 
                 currentMood === 'anxious' ? 'Stress Relief' : 
                 currentMood === 'withdrawn' ? 'Engagement' : 'General Wellness'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PersonalizedDashboard;
