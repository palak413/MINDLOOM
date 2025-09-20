import React from 'react';
import { Bell, Settings } from 'lucide-react';
import useAuthStore from '../../stores/authStore';

const Header = () => {
  const { user } = useAuthStore();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Welcome back, {user?.username}!
            </h2>
            <p className="text-gray-600">Ready to continue your wellness journey?</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="w-6 h-6" />
            </button>
            
            {/* User Avatar */}
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
