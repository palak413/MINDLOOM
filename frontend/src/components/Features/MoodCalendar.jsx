import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';
import { IoRefresh } from 'react-icons/io5';
import { moodAPI } from '../../services/api';

const MoodCalendar = () => {
  const [moodData, setMoodData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const moodColors = {
    'happy': 'bg-yellow-400',
    'calm': 'bg-blue-400',
    'neutral': 'bg-gray-400',
    'sad': 'bg-gray-600',
    'anxious': 'bg-red-400',
    'angry': 'bg-red-600',
    'excited': 'bg-purple-400',
    'grateful': 'bg-green-400'
  };

  const moodIcons = {
    'happy': '😊',
    'calm': '😌',
    'neutral': '😐',
    'sad': '😢',
    'anxious': '😰',
    'angry': '😠',
    'excited': '🤩',
    'grateful': '🙏'
  };

  useEffect(() => {
    fetchMoodData();
  }, [selectedMonth]);

  const fetchMoodData = async () => {
    setIsLoading(true);
    try {
      const response = await moodAPI.getMoodHistory();
      setMoodData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching mood data:', error);
      setMoodData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getMoodForDate = (date) => {
    if (!date) return null;
    const dateStr = date.toISOString().split('T')[0];
    return moodData.find(mood => mood.date === dateStr);
  };

  const getMoodStats = () => {
    const stats = {};
    moodData.forEach(mood => {
      stats[mood.mood] = (stats[mood.mood] || 0) + 1;
    });
    return stats;
  };

  const navigateMonth = (direction) => {
    setSelectedMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const days = getDaysInMonth(selectedMonth);
  const moodStats = getMoodStats();

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-4 h-[500px] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">Mood Calendar</h2>
          <p className="text-sm text-gray-600">Track your emotions</p>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-gray-600 text-sm font-bold">&lt;</span>
          </button>
          <span className="text-sm font-semibold text-gray-800 min-w-[100px] text-center">
            {months[selectedMonth.getMonth()].slice(0, 3)} {selectedMonth.getFullYear()}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-gray-600 text-sm font-bold">&gt;</span>
          </button>
        </div>
      </div>

      {/* Compact Mood Legend */}
      <div className="mb-4">
        <div className="grid grid-cols-4 gap-1">
          {Object.entries(moodColors).slice(0, 4).map(([mood, color]) => (
            <div key={mood} className="flex items-center space-x-1">
              <div className={`w-3 h-3 rounded-full ${color}`}></div>
              <span className="text-xs text-gray-600 capitalize truncate">{mood}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Compact Calendar Grid */}
      <div className="mb-4">
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={index} className="text-center text-xs font-semibold text-gray-600 py-1">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-0.5">
          {days.map((day, index) => {
            const mood = getMoodForDate(day);
            return (
              <motion.div
                key={index}
                className={`
                  aspect-square flex items-center justify-center text-xs rounded-md border transition-all duration-200
                  ${day 
                    ? mood 
                      ? `${moodColors[mood.mood]} text-white border-transparent hover:scale-105 cursor-pointer` 
                      : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 cursor-pointer'
                    : 'bg-transparent'
                  }
                `}
                whileHover={{ scale: day ? 1.05 : 1 }}
                whileTap={{ scale: day ? 0.95 : 1 }}
                title={day ? `${day.getDate()} - ${mood ? mood.mood : 'No mood logged'}` : ''}
              >
                {day && (
                  <>
                    {mood ? (
                      <span className="text-sm">{moodIcons[mood.mood]}</span>
                    ) : (
                      <span className="text-gray-400 text-xs">{day.getDate()}</span>
                    )}
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Compact Mood Summary */}
      <div className="bg-blue-50 rounded-xl p-3 mb-3">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">This Month</h3>
        {Object.keys(moodStats).length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {Object.entries(moodStats)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 3)
              .map(([mood, count]) => (
                <div key={mood} className="flex items-center space-x-1 bg-white rounded-lg px-2 py-1">
                  <span className="text-sm">{moodIcons[mood]}</span>
                  <span className="text-xs text-gray-600">{count}</span>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500 text-xs">No mood data yet</p>
        )}
      </div>

      {/* Compact Quick Actions */}
      <div className="flex space-x-2 mt-auto">
        <button
          onClick={() => window.location.href = '/mood-tracking'}
          className="flex-1 bg-emerald-500 text-white py-2 px-3 rounded-lg hover:bg-emerald-600 transition-all duration-200 flex items-center justify-center space-x-1 text-sm"
        >
          <FaPlus className="w-3 h-3" />
          <span>Log Mood</span>
        </button>
        <button
          onClick={fetchMoodData}
          className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
        >
          <IoRefresh className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default MoodCalendar;
