import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  CheckSquare, 
  Leaf, 
  Heart, 
  Wind, 
  ShoppingBag, 
  Award, 
  MessageCircle, 
  Gamepad2,
  User,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  Headphones
} from 'lucide-react';
import useAuthStore from '../../stores/authStore';

const Sidebar = ({ onToggle }) => {
  const { user, logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    onToggle?.();
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Journal', href: '/journal', icon: BookOpen },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Plant Care', href: '/plant', icon: Leaf },
    { name: 'Mood Tracking', href: '/mood', icon: Heart },
    { name: 'Breathing', href: '/breathing', icon: Wind },
    { name: 'Meditation & Music', href: '/meditation', icon: Headphones },
    { name: 'Games', href: '/games', icon: Gamepad2 },
    { name: 'Store', href: '/store', icon: ShoppingBag },
    { name: 'Badges', href: '/badges', icon: Award },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'Emergency', href: '/emergency', icon: AlertTriangle, priority: 'high' },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg h-screen fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out`}>
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">ML</span>
          </div>
          {!isCollapsed && <h1 className="text-xl font-bold text-gray-800">MindLoom</h1>}
        </div>

        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          className="absolute top-6 right-4 p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          {isCollapsed ? <Menu className="w-5 h-5 text-gray-600" /> : <X className="w-5 h-5 text-gray-600" />}
        </button>

        {/* User Info */}
        {!isCollapsed && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-800">{user?.username}</p>
            <p className="text-xs text-gray-500">{user?.points || 0} points</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2 rounded-lg transition-colors duration-200 ${
                    item.priority === 'high'
                      ? isActive
                        ? 'bg-red-50 text-red-700 border-r-2 border-red-700'
                        : 'text-red-600 hover:bg-red-50 hover:text-red-800'
                      : isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`
                }
                title={isCollapsed ? item.name : ''}
              >
                <Icon className={`w-5 h-5 ${item.priority === 'high' ? 'text-red-500' : ''}`} />
                {!isCollapsed && (
                  <span className={`font-medium ${item.priority === 'high' ? 'text-red-600' : ''}`}>
                    {item.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-3'} py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200 w-full`}
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
