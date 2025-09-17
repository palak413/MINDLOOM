import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthProvider';

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { isAuthenticated } = useAuth(); // Get auth state from our AuthProvider

    useEffect(() => {
        if (isAuthenticated) {
            // If the user is logged in, establish a socket connection.
            // The `withCredentials: true` is crucial for sending the auth cookie.
            const newSocket = io('http://localhost:8000', {
                withCredentials: true,
            });

            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
            });

            // Clean up the connection when the component unmounts or user logs out
            return () => newSocket.disconnect();
        } else {
            // If the user is not logged in, ensure no socket connection exists
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
    }, [isAuthenticated]); // This effect re-runs whenever the auth state changes

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};