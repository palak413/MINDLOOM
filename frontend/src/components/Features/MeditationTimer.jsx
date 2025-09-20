import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../Icons/IconSystem';

const MeditationTimer = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
  const [selectedDuration, setSelectedDuration] = useState(600);
  const [selectedSession, setSelectedSession] = useState('breathing');
  const [currentPhase, setCurrentPhase] = useState('preparation');
  const intervalRef = useRef(null);

  const durations = [
    { value: 300, label: '5 min', color: 'bg-blue-500' },
    { value: 600, label: '10 min', color: 'bg-emerald-500' },
    { value: 900, label: '15 min', color: 'bg-purple-500' },
    { value: 1800, label: '30 min', color: 'bg-orange-500' }
  ];

  const sessions = [
    {
      id: 'breathing',
      name: 'Breathing Exercise',
      icon: '💨',
      description: 'Focus on your breath and find inner calm',
      color: 'bg-blue-500'
    },
    {
      id: 'mindfulness',
      name: 'Mindfulness',
      icon: '🧘',
      description: 'Present moment awareness and acceptance',
      color: 'bg-purple-500'
    },
    {
      id: 'body-scan',
      name: 'Body Scan',
      icon: '🫁',
      description: 'Progressive relaxation through body awareness',
      color: 'bg-emerald-500'
    },
    {
      id: 'loving-kindness',
      name: 'Loving Kindness',
      icon: '❤️',
      description: 'Cultivate compassion and positive emotions',
      color: 'bg-pink-500'
    }
  ];

  const phases = {
    preparation: {
      title: 'Preparation',
      instruction: 'Find a comfortable position. Close your eyes and take a few deep breaths.',
      duration: 30
    },
    main: {
      title: 'Main Practice',
      instruction: 'Follow the guided meditation. Let thoughts come and go without judgment.',
      duration: selectedDuration - 60
    },
    closing: {
      title: 'Closing',
      instruction: 'Slowly bring your awareness back. Wiggle your fingers and toes.',
      duration: 30
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsActive(false);
            setCurrentPhase('completed');
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft]);

  const startTimer = () => {
    setTimeLeft(selectedDuration);
    setIsActive(true);
    setCurrentPhase('preparation');
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration);
    setCurrentPhase('preparation');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((selectedDuration - timeLeft) / selectedDuration) * 100;
  };

  const getCurrentInstruction = () => {
    const session = sessions.find(s => s.id === selectedSession);
    return session ? session.description : 'Focus on your breath and find inner calm';
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Meditation Timer</h2>
        <p className="text-gray-600">Find peace and mindfulness</p>
      </div>

      {/* Session Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Your Practice</h3>
        <div className="grid grid-cols-2 gap-3">
          {sessions.map((session) => (
            <motion.button
              key={session.id}
              onClick={() => setSelectedSession(session.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedSession === session.id
                  ? `${session.color} text-white border-transparent`
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{session.icon}</div>
                <div className="font-semibold text-sm">{session.name}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Duration Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Duration</h3>
        <div className="grid grid-cols-4 gap-3">
          {durations.map((duration) => (
            <motion.button
              key={duration.value}
              onClick={() => {
                setSelectedDuration(duration.value);
                setTimeLeft(duration.value);
              }}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                selectedDuration === duration.value
                  ? `${duration.color} text-white border-transparent`
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-center">
                <div className="font-semibold">{duration.label}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-8">
        <div className="relative w-64 h-64 mx-auto mb-6">
          {/* Progress Circle */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="#10b981"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: '283 283', strokeDashoffset: '283' }}
              animate={{ 
                strokeDasharray: '283 283',
                strokeDashoffset: 283 - (283 * getProgressPercentage() / 100)
              }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          
          {/* Time Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-1">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-600">
                {currentPhase === 'completed' ? 'Complete!' : phases[currentPhase]?.title || 'Ready'}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {!isActive ? (
            <motion.button
              onClick={startTimer}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon name="play" size="sm" />
              <span>Start</span>
            </motion.button>
          ) : (
            <>
              <motion.button
                onClick={pauseTimer}
                className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-yellow-600 hover:to-orange-700 transition-all duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon name="pause" size="sm" />
                <span>Pause</span>
              </motion.button>
              <motion.button
                onClick={resetTimer}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon name="refresh" size="sm" />
                <span>Reset</span>
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Current Instruction */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {phases[currentPhase]?.title || 'Ready to Begin'}
        </h3>
        <p className="text-gray-600 mb-4">
          {phases[currentPhase]?.instruction || getCurrentInstruction()}
        </p>
        
        {isActive && (
          <div className="flex items-center justify-center space-x-2 text-emerald-600">
            <Icon name="sparkles" size="sm" />
            <span className="text-sm font-medium">Session in progress...</span>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-xl">
          <Icon name="leaf" size="lg" className="text-blue-600 mx-auto mb-2" />
          <h4 className="font-semibold text-gray-800 mb-1">Comfortable Position</h4>
          <p className="text-sm text-gray-600">Sit or lie in a comfortable position</p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-xl">
          <Icon name="eye" size="lg" className="text-purple-600 mx-auto mb-2" />
          <h4 className="font-semibold text-gray-800 mb-1">Close Your Eyes</h4>
          <p className="text-sm text-gray-600">Reduce external distractions</p>
        </div>
        <div className="text-center p-4 bg-emerald-50 rounded-xl">
          <Icon name="brain" size="lg" className="text-emerald-600 mx-auto mb-2" />
          <h4 className="font-semibold text-gray-800 mb-1">Gentle Focus</h4>
          <p className="text-sm text-gray-600">Let thoughts come and go naturally</p>
        </div>
      </div>
    </motion.div>
  );
};

export default MeditationTimer;
