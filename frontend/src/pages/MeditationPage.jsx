import React from 'react';
import TrackList from '../features/meditation/TrackList';
import { Card } from '../../components/ui/card';

function MeditationPage() {
    return (
        // Main container for the background image
        <div 
            className="min-h-screen rounded-lg p-6 md:p-10 -m-8" // Use negative margin to fill parent padding
            style={{
                backgroundImage: `url('/images/meditation-bg.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Inner container with a semi-transparent overlay for readability */}
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8">
                <h1 className="text-4xl font-bold text-white mb-2" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
                    Music & Meditation
                </h1>
                <p className="text-gray-200 mb-8" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
                    Select a track below to begin your session of calm and focus.
                </p>
                
                {/* The TrackList component now sits on top of our beautiful background */}
                <TrackList />
            </div>
        </div>
    );
}

export default MeditationPage;