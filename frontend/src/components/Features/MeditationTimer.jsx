import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaStop, FaPlus } from 'react-icons/fa';
import { IoRefresh } from 'react-icons/io5';

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
      className="bg-white rounded-2xl shadow-lg p-4 h-[500px] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Meditation Timer</h2>
        <p className="text-sm text-gray-600">Find inner peace</p>
      </div>

      {/* Duration Selection */}
      <div className="mb-4">
        <div className="grid grid-cols-4 gap-1">
          {durations.map((duration) => (
            <motion.button
              key={duration.value}
              onClick={() => {
                setSelectedDuration(duration.value);
                setTimeLeft(duration.value);
              }}
              className={`p-2 rounded-lg border transition-all duration-200 text-xs ${
                selectedDuration === duration.value
                  ? `${duration.color} text-white border-transparent`
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {duration.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Compact Timer Display */}
      <div className="text-center mb-4">
        <div className="relative w-32 h-32 mx-auto mb-3">
          {/* Progress Circle */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#e5e7eb"
              strokeWidth="6"
              fill="none"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="#10b981"
              strokeWidth="6"
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
              <div className="text-2xl font-bold text-gray-800">
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs text-gray-600">
                {currentPhase === 'completed' ? 'Done!' : 'Ready'}
              </div>
            </div>
          </div>
        </div>

        {/* Compact Controls */}
        <div className="flex justify-center space-x-2">
          {!isActive ? (
            <motion.button
              onClick={startTimer}
              className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-all duration-200 flex items-center space-x-1 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlay className="w-3 h-3" />
              <span>Start</span>
            </motion.button>
          ) : (
            <>
              <motion.button
                onClick={pauseTimer}
                className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-200 text-sm flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPause className="w-3 h-3" />
              </motion.button>
              <motion.button
                onClick={resetTimer}
                className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 text-sm flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaStop className="w-3 h-3" />
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Session Selection - Compact */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Practice</h3>
        <div className="grid grid-cols-2 gap-2">
          {sessions.slice(0, 4).map((session) => (
            <motion.button
              key={session.id}
              onClick={() => setSelectedSession(session.id)}
              className={`p-2 rounded-lg border transition-all duration-200 ${
                selectedSession === session.id
                  ? `${session.color} text-white border-transparent`
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="text-lg mb-1">{session.icon}</div>
                <div className="font-medium text-xs truncate">{session.name}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Compact Stats */}
      <div className="bg-blue-50 rounded-xl p-3 mt-auto">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          {phases[currentPhase]?.title || 'Ready to Begin'}
        </h3>
        <p className="text-xs text-gray-600">
          {isActive ? 'Session in progress...' : getCurrentInstruction()}
        </p>
      </div>
    </motion.div>
  );
};

export default MeditationTimer;
