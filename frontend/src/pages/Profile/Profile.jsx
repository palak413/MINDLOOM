import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Mail, 
  Calendar, 
  TrendingUp, 
  Award, 
  Target,
  BookOpen,
  Heart,
  Wind,
  Leaf,
  Edit3,
  Save,
  X,
  Settings,
  Bell,
  Shield,
  LogOut
} from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import { userAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, setUser, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    journalEntries: 0,
    moodEntries: 0,
    breathingSessions: 0,
    plantLevel: 1,
    badges: 0
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    setIsLoading(true);
    try {
      // Mock stats - in real app, these would come from API
      setStats({
        totalTasks: 25,
        completedTasks: 18,
        journalEntries: 12,
        moodEntries: 15,
        breathingSessions: 8,
        plantLevel: 3,
        badges: 5
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await userAPI.updateProfile(data);
      setUser({ ...user, ...data });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const getJoinDate = () => {
    return new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCompletionRate = () => {
    return stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
            <p className="text-gray-600">Manage your account and view stats</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-secondary flex items-center space-x-2"
        >
          <Edit3 className="w-4 h-4" />
          <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="card">
        <div className="flex items-start space-x-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      {...register('username', { required: 'Username is required' })}
                      defaultValue={user?.username}
                      className="input-field"
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      defaultValue={user?.email}
                      className="input-field"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{user?.username}</h2>
                <div className="flex items-center space-x-4 text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {getJoinDate()}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-lg">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-semibold">{user?.points || 0} Points</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Target className="w-4 h-4" />
                    <span>{user?.currentStreak || 0} Day Streak</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Task Completion</p>
              <p className="text-2xl font-bold text-gray-900">{getCompletionRate()}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Journal Entries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.journalEntries}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Plant Level</p>
              <p className="text-2xl font-bold text-gray-900">{stats.plantLevel}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Badges Earned</p>
              <p className="text-2xl font-bold text-gray-900">{stats.badges}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Overview */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Heart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-800 mb-1">Mood Entries</h4>
            <p className="text-2xl font-bold text-blue-600">{stats.moodEntries}</p>
            <p className="text-sm text-gray-600">Total mood logs</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Wind className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-800 mb-1">Breathing Sessions</h4>
            <p className="text-2xl font-bold text-purple-600">{stats.breathingSessions}</p>
            <p className="text-sm text-gray-600">Completed sessions</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-800 mb-1">Tasks Completed</h4>
            <p className="text-2xl font-bold text-green-600">{stats.completedTasks}</p>
            <p className="text-sm text-gray-600">Out of {stats.totalTasks} total</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-800">Notifications</p>
                <p className="text-sm text-gray-600">Manage your notification preferences</p>
              </div>
            </div>
            <button className="btn-secondary text-sm">
              Configure
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-800">Privacy</p>
                <p className="text-sm text-gray-600">Control your privacy settings</p>
              </div>
            </div>
            <button className="btn-secondary text-sm">
              Manage
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-800">Preferences</p>
                <p className="text-sm text-gray-600">Customize your app experience</p>
              </div>
            </div>
            <button className="btn-secondary text-sm">
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-red-200">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
          <div>
            <p className="font-medium text-red-800">Sign Out</p>
            <p className="text-sm text-red-600">Sign out of your account</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
