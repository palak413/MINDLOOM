import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './stores/authStore';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Journal from './pages/Journal/Journal';
import Tasks from './pages/Tasks/Tasks';
import PlantCare from './pages/PlantCare/PlantCare';
import MoodTracking from './pages/MoodTracking/MoodTracking';
import BreathingExercises from './pages/BreathingExercises/BreathingExercises';
import Store from './pages/Store/Store';
import Badges from './pages/Badges/Badges';
import Chat from './pages/Chat/Chat';
import Profile from './pages/Profile/Profile';
import Games from './pages/Games/Games';
import Meditation from './pages/Meditation/Meditation';
import EmergencyServices from './pages/Emergency/EmergencyServices';

function App() {
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading MindLoom...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="journal" element={<Journal />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="plant" element={<PlantCare />} />
            <Route path="mood" element={<MoodTracking />} />
            <Route path="breathing" element={<BreathingExercises />} />
            <Route path="meditation" element={<Meditation />} />
            <Route path="store" element={<Store />} />
            <Route path="badges" element={<Badges />} />
            <Route path="chat" element={<Chat />} />
            <Route path="games" element={<Games />} />
            <Route path="profile" element={<Profile />} />
            <Route path="emergency" element={<EmergencyServices />} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
