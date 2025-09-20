import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../Icons/IconSystem';

const GoalTracker = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', category: 'wellness', target: 30, deadline: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const goalCategories = {
    'wellness': { icon: '🌱', color: 'bg-emerald-500', name: 'Wellness' },
    'career': { icon: '💼', color: 'bg-blue-500', name: 'Career' },
    'fitness': { icon: '💪', color: 'bg-orange-500', name: 'Fitness' },
    'learning': { icon: '📚', color: 'bg-purple-500', name: 'Learning' },
    'relationships': { icon: '❤️', color: 'bg-pink-500', name: 'Relationships' },
    'financial': { icon: '💰', color: 'bg-green-500', name: 'Financial' }
  };

  useEffect(() => {
    // Load mock goals
    const mockGoals = [
      {
        id: 1,
        title: 'Complete 30-day meditation challenge',
        description: 'Meditate for 10 minutes every day',
        category: 'wellness',
        target: 30,
        current: 12,
        deadline: '2024-02-15',
        status: 'active',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 2,
        title: 'Read 12 books this year',
        description: 'Read one book per month',
        category: 'learning',
        target: 12,
        current: 3,
        deadline: '2024-12-31',
        status: 'active',
        createdAt: new Date('2024-01-01')
      },
      {
        id: 3,
        title: 'Run 5K race',
        description: 'Complete a 5K running event',
        category: 'fitness',
        target: 1,
        current: 0,
        deadline: '2024-03-15',
        status: 'active',
        createdAt: new Date('2024-01-10')
      }
    ];
    setGoals(mockGoals);
  }, []);

  const addGoal = () => {
    if (!newGoal.title.trim()) return;
    
    const goal = {
      id: Date.now(),
      ...newGoal,
      current: 0,
      status: 'active',
      createdAt: new Date()
    };
    
    setGoals(prev => [...prev, goal]);
    setNewGoal({ title: '', description: '', category: 'wellness', target: 30, deadline: '' });
    setShowAddForm(false);
  };

  const updateProgress = (goalId, increment = 1) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { 
            ...goal, 
            current: Math.min(goal.current + increment, goal.target),
            status: goal.current + increment >= goal.target ? 'completed' : goal.status
          }
        : goal
    ));
  };

  const deleteGoal = (goalId) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Goal Tracker</h2>
          <p className="text-gray-600">Set goals and track your progress</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 flex items-center space-x-2"
        >
          <Icon name="add" size="sm" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Add Goal Form */}
      {showAddForm && (
        <motion.div
          className="mb-6 p-4 bg-gray-50 rounded-xl"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Goal</h3>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Goal title..."
                value={newGoal.title}
                onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <textarea
                placeholder="Goal description..."
                value={newGoal.description}
                onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {Object.entries(goalCategories).map(([key, category]) => (
                    <option key={key} value={key}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Target (e.g., 30)"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, target: parseInt(e.target.value) || 30 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={addGoal}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200"
              >
                Add Goal
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => (
          <motion.div
            key={goal.id}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              goal.status === 'completed' 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full ${goalCategories[goal.category].color} flex items-center justify-center text-white text-lg`}>
                  {goalCategories[goal.category].icon}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${goal.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {goal.title}
                  </h3>
                  <p className="text-sm text-gray-600">{goal.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(goal.status)}`}>
                  {goal.status}
                </span>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="w-6 h-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center justify-center"
                >
                  <Icon name="delete" size="xs" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-semibold text-gray-800">
                  {goal.current}/{goal.target}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${goalCategories[goal.category].color} transition-all duration-500`}
                  style={{ width: `${getProgressPercentage(goal.current, goal.target)}%` }}
                />
              </div>
            </div>

            {/* Goal Info */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Icon name="calendar" size="sm" className="text-blue-500" />
                  <span className="text-gray-600">
                    {getDaysRemaining(goal.deadline)} days left
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="trending" size="sm" className="text-emerald-500" />
                  <span className="text-gray-600">
                    {Math.round(getProgressPercentage(goal.current, goal.target))}% complete
                  </span>
                </div>
              </div>
              
              {goal.status !== 'completed' && (
                <button
                  onClick={() => updateProgress(goal.id)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-xs"
                >
                  +1 Progress
                </button>
              )}
            </div>

            {/* Completion Message */}
            {goal.status === 'completed' && (
              <div className="mt-3 flex items-center space-x-2 text-green-600">
                <Icon name="star" size="sm" />
                <span className="text-sm font-semibold">Goal completed! 🎉</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No goals yet</h3>
          <p className="text-gray-600 mb-6">Start achieving your dreams by setting your first goal!</p>
        </div>
      )}

      {/* Statistics */}
      {goals.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">
              {goals.filter(g => g.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active Goals</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600">
              {goals.filter(g => g.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(goals.reduce((sum, g) => sum + getProgressPercentage(g.current, g.target), 0) / goals.length)}%
            </div>
            <div className="text-sm text-gray-600">Avg Progress</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default GoalTracker;
