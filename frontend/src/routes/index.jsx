import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Route Guards
import ProtectedRoute from './ProtectedRoutes';
import AdminRoute from './AdminRoute';

// Import Page Components
import AuthPage from '../pages/AuthPage';
import DashboardPage from '../pages/DashboardPage';
import JournalPage from '../pages/JournalPage';
import StorePage from '../pages/StorePage';
import MeditationPage from '../pages/MeditationPage';
import ChatPage from '../pages/ChatPage';
import ProfilePage from '../pages/ProfilePage';
import AdminPage from '../pages/AdminPage';
import NotFoundPage from '../pages/NotFoundPage';

export const AppRoutes = () => {
    return (
        <Routes>
            {/* --- Public Routes --- */}
            {/* These routes are accessible to everyone */}
            <Route path="/login" element={<AuthPage />} /> 
            <Route path="/register" element={<AuthPage />} />

            {/* --- Protected User Routes --- */}
            {/* These routes are only accessible to logged-in users */}
            <Route path="/" element={<ProtectedRoute />}>
                <Route index element={<DashboardPage />} />
                <Route path="journal" element={<JournalPage />} />
                <Route path="store" element={<StorePage />} />
                <Route path="meditation" element={<MeditationPage />} />
                <Route path="chat" element={<ChatPage />} />
                <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* --- Protected Admin Routes --- */}
            {/* These routes are only accessible to users with the 'admin' role */}
            <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<AdminPage />} />
            </Route>
            
            {/* --- Catch-all Not Found Route --- */}
            {/* This MUST be the last route to handle any undefined paths */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};