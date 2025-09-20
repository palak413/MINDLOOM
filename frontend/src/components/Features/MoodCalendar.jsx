import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../Icons/IconSystem';
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
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Mood Calendar</h2>
          <p className="text-gray-600">Track your emotional journey</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="chevronLeft" size="sm" className="text-gray-600" />
          </button>
          <span className="text-lg font-semibold text-gray-800 min-w-[120px] text-center">
            {months[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="chevronRight" size="sm" className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Mood Legend */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Mood Legend</h3>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(moodColors).map(([mood, color]) => (
            <div key={mood} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full ${color}`}></div>
              <span className="text-xs text-gray-600 capitalize">{mood}</span>
              <span className="text-xs text-gray-400">({moodStats[mood] || 0})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mb-6">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const mood = getMoodForDate(day);
            return (
              <motion.div
                key={index}
                className={`
                  aspect-square flex items-center justify-center text-sm rounded-lg border-2 transition-all duration-200
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
                      <span className="text-lg">{moodIcons[mood.mood]}</span>
                    ) : (
                      <span className="text-gray-400">{day.getDate()}</span>
                    )}
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mood Statistics */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">This Month's Mood Trends</h3>
        {Object.keys(moodStats).length > 0 ? (
          <div className="space-y-2">
            {Object.entries(moodStats)
              .sort(([,a], [,b]) => b - a)
              .map(([mood, count]) => (
                <div key={mood} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{moodIcons[mood]}</span>
                    <span className="text-sm font-medium text-gray-700 capitalize">{mood}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${moodColors[mood]} transition-all duration-500`}
                        style={{ width: `${(count / moodData.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No mood data for this month. Start logging your moods!</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex space-x-3">
        <button
          onClick={fetchMoodData}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Icon name="refresh" size="sm" />
          <span>Refresh Data</span>
        </button>
        <button
          onClick={() => window.location.href = '/mood-tracking'}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2 px-4 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Icon name="add" size="sm" />
          <span>Log Mood</span>
        </button>
      </div>
    </motion.div>
  );
};

export default MoodCalendar;
