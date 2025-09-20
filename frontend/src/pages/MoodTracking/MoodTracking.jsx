import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Heart, 
  Smile, 
  Frown, 
  Meh, 
  Angry, 
  Zap,
  TrendingUp,
  Calendar,
  BarChart3,
  Plus
} from 'lucide-react';
import { moodAPI } from '../../services/api';
import toast from 'react-hot-toast';

const MoodTracking = () => {
  const [moods, setMoods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMood, setSelectedMood] = useState('');
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    setIsLoading(true);
    try {
      const response = await moodAPI.getMoodHistory();
      setMoods(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch mood history');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await moodAPI.logMood({
        ...data,
        mood: selectedMood
      });
      const newMood = response.data.data;
      setMoods(prev => [newMood, ...prev]);
      reset();
      setSelectedMood('');
      toast.success('Mood logged successfully!');
    } catch (error) {
      toast.error('Failed to log mood');
    } finally {
      setIsSubmitting(false);
    }
  };

  const moodOptions = [
    { value: 'happy', label: 'Happy', icon: '😊', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: 'calm', label: 'Calm', icon: '😌', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'neutral', label: 'Neutral', icon: '😐', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    { value: 'sad', label: 'Sad', icon: '😢', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    { value: 'anxious', label: 'Anxious', icon: '😰', color: 'bg-red-100 text-red-800 border-red-200' },
    { value: 'angry', label: 'Angry', icon: '😠', color: 'bg-red-100 text-red-800 border-red-200' },
  ];

  const getMoodIcon = (mood) => {
    const moodOption = moodOptions.find(option => option.value === mood);
    return moodOption ? moodOption.icon : '😐';
  };

  const getMoodColor = (mood) => {
    const moodOption = moodOptions.find(option => option.value === mood);
    return moodOption ? moodOption.color : 'bg-gray-100 text-gray-800';
  };

  const getStressLevelColor = (level) => {
    if (level <= 3) return 'text-green-600';
    if (level <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStressLevelText = (level) => {
    if (level <= 3) return 'Low';
    if (level <= 6) return 'Medium';
    return 'High';
  };

  // Calculate mood statistics
  const moodStats = moods.reduce((acc, mood) => {
    acc[mood.mood] = (acc[mood.mood] || 0) + 1;
    return acc;
  }, {});

  const averageStress = moods.length > 0 
    ? Math.round(moods.reduce((sum, mood) => sum + mood.stressLevel, 0) / moods.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mood Tracking</h1>
            <p className="text-gray-600">Track your emotional well-being</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>{moods.length} entries</span>
        </div>
      </div>

      {/* Mood Statistics */}
      {moods.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Stress</p>
                <p className={`text-2xl font-bold ${getStressLevelColor(averageStress)}`}>
                  {averageStress}/10
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Most Common Mood</p>
                <p className="text-lg font-bold text-gray-900">
                  {Object.keys(moodStats).length > 0 
                    ? Object.keys(moodStats).reduce((a, b) => moodStats[a] > moodStats[b] ? a : b)
                    : 'None'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold text-gray-900">{moods.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Mood Form */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">How are you feeling?</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select your current mood
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedMood === mood.value
                      ? `${mood.color} border-current`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{mood.icon}</div>
                  <div className="text-sm font-medium">{mood.label}</div>
                </button>
              ))}
            </div>
            {!selectedMood && (
              <p className="text-red-500 text-sm mt-2">Please select a mood</p>
            )}
          </div>

          {/* Stress Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stress Level (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              {...register('stressLevel', { 
                required: 'Stress level is required',
                min: { value: 1, message: 'Minimum stress level is 1' },
                max: { value: 10, message: 'Maximum stress level is 10' }
              })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low (1)</span>
              <span>High (10)</span>
            </div>
            {errors.stressLevel && (
              <p className="text-red-500 text-sm mt-1">{errors.stressLevel.message}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              placeholder="What's contributing to your mood today?"
            />
          </div>

          <button
            type="submit"
            disabled={!selectedMood || isSubmitting}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Logging...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Log Mood</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Mood History */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Mood History</h2>
          <div className="text-sm text-gray-500">
            Last 7 days
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          </div>
        ) : moods.length > 0 ? (
          <div className="space-y-3">
            {moods.slice(0, 10).map((mood) => (
              <div key={mood._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{getMoodIcon(mood.mood)}</div>
                  <div>
                    <p className="font-medium text-gray-800 capitalize">{mood.mood}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(mood.createdAt).toLocaleDateString()} at{' '}
                      {new Date(mood.createdAt).toLocaleTimeString()}
                    </p>
                    {mood.notes && (
                      <p className="text-sm text-gray-600 mt-1">{mood.notes}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getStressLevelColor(mood.stressLevel)}`}>
                    {mood.stressLevel}/10
                  </p>
                  <p className="text-xs text-gray-500">
                    {getStressLevelText(mood.stressLevel)} stress
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No mood entries yet</h3>
            <p className="text-gray-400">Start tracking your mood to see patterns!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracking;
