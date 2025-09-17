import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import apiClient from '../lib/axios';

// 1. Create the context
export const AuthContext = createContext(null);

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Used to check session status on initial load

    useEffect(() => {
        // This function runs once when the app first loads
        const fetchUserOnLoad = async () => {
            try {
                // The backend will check for a valid session cookie and return the user if logged in
                const response = await apiClient.get('/users/me');
                setUser(response.data.data);
            } catch (error) {
                // If the request fails (e.g., 401 Unauthorized), it means no user is logged in
                setUser(null);
            } finally {
                // We're done checking, so set loading to false
                setLoading(false);
            }
        };
        
        fetchUserOnLoad();
    }, []);

    // Function to set user data after a successful login
    const login = (userData) => {
        setUser(userData);
    };

    // Function to log the user out
    const logout = async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setUser(null);
        }
    };

    // Function to allow other components to update the user's data (e.g., after buying an item)
    const updateUser = (updatedData) => {
        setUser(prevUser => ({ ...prevUser, ...updatedData }));
    };

    // Memoize the context value to prevent unnecessary re-renders of consuming components
    const authContextValue = useMemo(() => ({
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
    }), [user, loading]);

    return (
        <AuthContext.Provider value={authContextValue}>
            {/* Don't render the rest of the app until the initial session check is complete */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

// 3. Create a custom hook for easy access to the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};