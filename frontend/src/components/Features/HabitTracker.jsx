import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../Icons/IconSystem';
import { taskAPI } from '../../services/api';

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const habitCategories = {
    'wellness': { icon: '🌱', color: 'bg-emerald-500', name: 'Wellness' },
    'productivity': { icon: '⚡', color: 'bg-blue-500', name: 'Productivity' },
    'mindfulness': { icon: '🧘', color: 'bg-purple-500', name: 'Mindfulness' },
    'fitness': { icon: '💪', color: 'bg-orange-500', name: 'Fitness' },
    'learning': { icon: '📚', color: 'bg-indigo-500', name: 'Learning' },
    'social': { icon: '👥', color: 'bg-pink-500', name: 'Social' }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    setIsLoading(true);
    try {
      // For now, we'll use mock data. In a real app, you'd have a habits API
      const mockHabits = [
        {
          id: 1,
          name: 'Morning Meditation',
          category: 'mindfulness',
          streak: 7,
          target: 30,
          completed: true,
          frequency: 'daily'
        },
        {
          id: 2,
          name: 'Drink 8 Glasses of Water',
          category: 'wellness',
          streak: 3,
          target: 30,
          completed: false,
          frequency: 'daily'
        },
        {
          id: 3,
          name: 'Read for 30 minutes',
          category: 'learning',
          streak: 12,
          target: 30,
          completed: true,
          frequency: 'daily'
        },
        {
          id: 4,
          name: 'Exercise',
          category: 'fitness',
          streak: 5,
          target: 30,
          completed: false,
          frequency: 'daily'
        }
      ];
      setHabits(mockHabits);
    } catch (error) {
      console.error('Error fetching habits:', error);
      setHabits([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleHabit = async (habitId) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId 
        ? { 
            ...habit, 
            completed: !habit.completed,
            streak: habit.completed ? habit.streak - 1 : habit.streak + 1
          }
        : habit
    ));
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    
    const habit = {
      id: Date.now(),
      name: newHabit.trim(),
      category: 'wellness',
      streak: 0,
      target: 30,
      completed: false,
      frequency: 'daily'
    };
    
    setHabits(prev => [...prev, habit]);
    setNewHabit('');
  };

  const deleteHabit = (habitId) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
  };

  const getStreakColor = (streak) => {
    if (streak >= 30) return 'text-green-600';
    if (streak >= 14) return 'text-blue-600';
    if (streak >= 7) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getProgressPercentage = (streak, target) => {
    return Math.min((streak / target) * 100, 100);
  };

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
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Habit Tracker</h2>
          <p className="text-gray-600">Build healthy habits, one day at a time</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-600">
            {habits.filter(h => h.completed).length}/{habits.length}
          </div>
          <div className="text-sm text-gray-500">Completed Today</div>
        </div>
      </div>

      {/* Add New Habit */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Add a new habit..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && addHabit()}
          />
          <button
            onClick={addHabit}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 flex items-center space-x-2"
          >
            <Icon name="add" size="sm" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-4">
        {habits.map((habit) => (
          <motion.div
            key={habit.id}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              habit.completed 
                ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Habit Icon */}
                <div className={`w-12 h-12 rounded-full ${habitCategories[habit.category].color} flex items-center justify-center text-white text-xl`}>
                  {habitCategories[habit.category].icon}
                </div>
                
                {/* Habit Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className={`text-lg font-semibold ${habit.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {habit.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${habitCategories[habit.category].color} text-white`}>
                      {habitCategories[habit.category].name}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${habitCategories[habit.category].color} transition-all duration-500`}
                        style={{ width: `${getProgressPercentage(habit.streak, habit.target)}%` }}
                      />
                    </div>
                    <span className={`text-sm font-semibold ${getStreakColor(habit.streak)}`}>
                      {habit.streak}/{habit.target} days
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                    habit.completed 
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <Icon name={habit.completed ? 'check' : 'plus'} size="sm" />
                </button>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center justify-center"
                >
                  <Icon name="delete" size="sm" />
                </button>
              </div>
            </div>
            
            {/* Streak Info */}
            <div className="mt-3 flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Icon name="sparkles" size="sm" className="text-yellow-500" />
                  <span className="text-gray-600">
                    {habit.streak} day streak
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="calendar" size="sm" className="text-blue-500" />
                  <span className="text-gray-600 capitalize">{habit.frequency}</span>
                </div>
              </div>
              
              {habit.streak >= 7 && (
                <div className="flex items-center space-x-1 text-emerald-600">
                  <Icon name="star" size="sm" />
                  <span className="font-semibold">Great streak!</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {habits.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No habits yet</h3>
          <p className="text-gray-600 mb-6">Start building healthy habits by adding your first one!</p>
        </div>
      )}

      {/* Statistics */}
      {habits.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">
              {habits.reduce((sum, h) => sum + h.streak, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Streaks</div>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-xl">
            <div className="text-2xl font-bold text-emerald-600">
              {Math.round(habits.reduce((sum, h) => sum + getProgressPercentage(h.streak, h.target), 0) / habits.length)}%
            </div>
            <div className="text-sm text-gray-600">Avg Progress</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">
              {habits.filter(h => h.streak >= 7).length}
            </div>
            <div className="text-sm text-gray-600">7+ Day Streaks</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HabitTracker;
