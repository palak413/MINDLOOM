import React, { useState, useEffect } from 'react';
import BreathingAnimator from './BreathingAnimator';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/axios';

// The cycle of phases, text, and durations
const CYCLE = [
    { text: 'Inhale...', phase: 'inhale', duration: 4000 },
    { text: 'Hold', phase: 'hold', duration: 7000 },
    { text: 'Exhale...', phase: 'exhale', duration: 8000 },
];

function SoloBreathing({ onFinish }) {
    const [cycleIndex, setCycleIndex] = useState(0);

    // This useEffect hook acts as the "conductor" for the animation
    useEffect(() => {
        const timer = setTimeout(() => {
            setCycleIndex((prevIndex) => (prevIndex + 1) % CYCLE.length);
        }, CYCLE[cycleIndex].duration);

        // Cleanup the timer if the component unmounts
        return () => clearTimeout(timer);
    }, [cycleIndex]);
    
    const handleFinish = async () => {
        try {
            await apiClient.post('/breathing/session');
            // We can add a success toast here
        } catch (error) {
            console.error("Failed to log breathing session", error);
        }
        onFinish(); // Go back to the main breathing page
    };

    const currentCycle = CYCLE[cycleIndex];

    return (
        <div className="flex flex-col items-center justify-center space-y-12">
            <div className="relative">
                <BreathingAnimator phase={currentCycle.phase} />
                {/* We place the text on top of the animator */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-white z-10 select-none">
                        {currentCycle.text}
                    </span>
                </div>
            </div>
            <Button onClick={handleFinish} variant="outline">End Session</Button>
        </div>
    );
}

export default SoloBreathing;