import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Trophy, 
  Star, 
  Target, 
  Calendar,
  TrendingUp,
  Lock,
  CheckCircle,
  Sparkles,
  Crown,
  Heart,
  Wind,
  BookOpen,
  CheckSquare
} from 'lucide-react';
import { badgeAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Badges = () => {
  const [badges, setBadges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    setIsLoading(true);
    try {
      const response = await badgeAPI.getBadges();
      setBadges(response.data.data || []);
      // Mock user badges for demo
      setUserBadges(['first-task', 'journal-streak', 'breathing-master']);
    } catch (error) {
      toast.error('Failed to fetch badges');
    } finally {
      setIsLoading(false);
    }
  };

  const getBadgeIcon = (badgeName) => {
    if (badgeName.includes('task')) return <CheckSquare className="w-6 h-6" />;
    if (badgeName.includes('journal')) return <BookOpen className="w-6 h-6" />;
    if (badgeName.includes('breathing')) return <Wind className="w-6 h-6" />;
    if (badgeName.includes('mood')) return <Heart className="w-6 h-6" />;
    if (badgeName.includes('streak')) return <TrendingUp className="w-6 h-6" />;
    if (badgeName.includes('master')) return <Crown className="w-6 h-6" />;
    return <Star className="w-6 h-6" />;
  };

  const getBadgeColor = (badgeName) => {
    if (badgeName.includes('master') || badgeName.includes('legend')) return 'from-yellow-400 to-orange-500';
    if (badgeName.includes('streak')) return 'from-blue-400 to-purple-500';
    if (badgeName.includes('first')) return 'from-green-400 to-blue-500';
    return 'from-purple-400 to-pink-500';
  };

  const isEarned = (badgeId) => {
    return userBadges.includes(badgeId);
  };

  const filteredBadges = badges.filter(badge => {
    if (filter === 'all') return true;
    if (filter === 'earned') return isEarned(badge._id);
    if (filter === 'locked') return !isEarned(badge._id);
    return true;
  });

  const earnedCount = badges.filter(badge => isEarned(badge._id)).length;
  const totalCount = badges.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Badges & Achievements</h1>
            <p className="text-gray-600">Track your wellness milestones</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Trophy className="w-4 h-4" />
          <span>{earnedCount}/{totalCount} earned</span>
        </div>
      </div>

      {/* Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Achievement Progress</span>
          <span className="text-sm text-gray-500">{Math.round((earnedCount / totalCount) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(earnedCount / totalCount) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>{totalCount}</span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Badges
        </button>
        <button
          onClick={() => setFilter('earned')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            filter === 'earned'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Earned
        </button>
        <button
          onClick={() => setFilter('locked')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            filter === 'locked'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Locked
        </button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="card animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          ))
        ) : filteredBadges.length > 0 ? (
          filteredBadges.map((badge) => {
            const earned = isEarned(badge._id);
            
            return (
              <div 
                key={badge._id} 
                className={`card transition-all duration-200 ${
                  earned 
                    ? 'ring-2 ring-yellow-400 shadow-lg' 
                    : 'opacity-60'
                }`}
              >
                <div className="text-center">
                  {/* Badge Icon */}
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    earned 
                      ? `bg-gradient-to-r ${getBadgeColor(badge.name)} text-white shadow-lg` 
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {earned ? (
                      getBadgeIcon(badge.name)
                    ) : (
                      <Lock className="w-8 h-8" />
                    )}
                  </div>

                  {/* Badge Info */}
                  <h3 className={`text-lg font-semibold mb-2 ${
                    earned ? 'text-gray-800' : 'text-gray-500'
                  }`}>
                    {badge.name}
                  </h3>
                  
                  <p className={`text-sm mb-4 ${
                    earned ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {badge.description}
                  </p>

                  {/* Criteria */}
                  <div className={`p-3 rounded-lg ${
                    earned ? 'bg-green-50' : 'bg-gray-50'
                  }`}>
                    <p className={`text-xs font-medium ${
                      earned ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {badge.criteria}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="mt-4">
                    {earned ? (
                      <div className="flex items-center justify-center space-x-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Earned!</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2 text-gray-400">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm">Locked</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">No badges found</h3>
            <p className="text-gray-400">
              {filter === 'earned' 
                ? "You haven't earned any badges yet." 
                : "No badges match your current filter."
              }
            </p>
          </div>
        )}
      </div>

      {/* Achievement Categories */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Achievement Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <CheckSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-800 mb-1">Task Master</h4>
            <p className="text-sm text-gray-600">Complete tasks to earn badges</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <BookOpen className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-800 mb-1">Journal Keeper</h4>
            <p className="text-sm text-gray-600">Write journal entries regularly</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Wind className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-800 mb-1">Breathing Pro</h4>
            <p className="text-sm text-gray-600">Master breathing exercises</p>
          </div>
          
          <div className="text-center p-4 bg-pink-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-pink-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-800 mb-1">Streak Champion</h4>
            <p className="text-sm text-gray-600">Maintain daily streaks</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tips to Earn More Badges</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-yellow-600 text-sm">1</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Complete Daily Tasks</p>
              <p className="text-sm text-gray-600">Finish your daily wellness tasks to earn task-related badges</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-sm">2</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Maintain Streaks</p>
              <p className="text-sm text-gray-600">Use the app daily to build streaks and unlock streak badges</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 text-sm">3</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Explore All Features</p>
              <p className="text-sm text-gray-600">Try journaling, breathing exercises, and mood tracking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Badges;
