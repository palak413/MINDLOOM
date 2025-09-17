import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AudioPlayer from '@/features/meditation/AudioPlayer'; // <-- IMPORT
import { Toaster } from "@/components/ui/toaster";

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-50 text-gray-800">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                {/* Add padding-bottom to the main content to avoid overlap with the player */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto pb-20">
                    <div className="container mx-auto px-6 py-8">
                        {children}
                    </div>
                </main>
            </div>
            <AudioPlayer /> {/* <-- ADD THE PLAYER HERE */}
            <Toaster />
        </div>
    );
};

export default Layout;