import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import FloatingChat from '../AIAssistant/FloatingChat';

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        {/* Main Content */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <Header />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
      
      {/* Floating AI Assistant - Available on all pages */}
      <FloatingChat />
    </div>
  );
};

export default Layout;
