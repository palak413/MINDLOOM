import React from 'react';
import { motion } from 'framer-motion';

// Define the animation states (variants)
const animatorVariants = {
    inhale: {
        scale: 1.5,
        transition: { duration: 4, ease: "easeInOut" }
    },
    hold: {
        scale: 1.5,
        transition: { duration: 7, ease: "easeInOut" }
    },
    exhale: {
        scale: 1,
        transition: { duration: 8, ease: "easeInOut" }
    }
};

function BreathingAnimator({ phase }) {
    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* The main animated circle */}
            <motion.div
                className="absolute w-full h-full bg-green-200 rounded-full"
                variants={animatorVariants}
                animate={phase} // The current phase controls the animation state
            />
            {/* A static inner circle for depth */}
            <div className="absolute w-5/6 h-5/6 bg-green-300 rounded-full opacity-75" />
        </div>
    );
}

export default BreathingAnimator;