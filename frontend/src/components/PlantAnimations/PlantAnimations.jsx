import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const PlantGrowthAnimation = ({ level, isGrowing = false }) => {
  const [showGrowthEffect, setShowGrowthEffect] = useState(false);

  useEffect(() => {
    if (isGrowing) {
      setShowGrowthEffect(true);
      const timer = setTimeout(() => setShowGrowthEffect(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isGrowing]);

  const getPlantStages = () => {
    const stages = [
      { emoji: '🌱', name: 'Seedling', color: 'from-green-400 to-emerald-500' },
      { emoji: '🌿', name: 'Sprout', color: 'from-green-500 to-emerald-600' },
      { emoji: '🌳', name: 'Sapling', color: 'from-green-600 to-emerald-700' },
      { emoji: '🌲', name: 'Tree', color: 'from-green-700 to-emerald-800' },
      { emoji: '🌸', name: 'Flowering', color: 'from-pink-400 to-rose-500' },
      { emoji: '🌺', name: 'Blooming', color: 'from-pink-500 to-rose-600' },
      { emoji: '🌻', name: 'Mature', color: 'from-yellow-400 to-orange-500' },
      { emoji: '🌷', name: 'Elder', color: 'from-purple-400 to-violet-500' },
      { emoji: '🌹', name: 'Legendary', color: 'from-red-400 to-pink-500' },
      { emoji: '🌟', name: 'Divine', color: 'from-yellow-300 to-white' }
    ];
    
    return stages[Math.min(level - 1, stages.length - 1)];
  };

  const currentStage = getPlantStages();

  return (
    <div className="relative">
      {/* Main Plant */}
      <motion.div
        className="relative"
        animate={{
          scale: isGrowing ? [1, 1.2, 1] : 1,
          rotate: isGrowing ? [0, 5, -5, 0] : 0,
        }}
        transition={{
          duration: 2,
          ease: "easeInOut"
        }}
      >
        <div className="text-8xl mb-4">{currentStage.emoji}</div>
        
        {/* Growth Ring Effect */}
        {showGrowthEffect && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 rounded-full border-4 border-green-400 pointer-events-none"
          />
        )}
      </motion.div>

      {/* Floating Particles */}
      <AnimatePresence>
        {showGrowthEffect && (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  scale: 0, 
                  x: 0, 
                  y: 0,
                  opacity: 1 
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 200,
                  opacity: [1, 0.5, 0]
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-green-400 rounded-full"
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Level Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r ${currentStage.color} rounded-full flex items-center justify-center shadow-lg`}
      >
        <span className="text-white font-bold text-sm">{level}</span>
      </motion.div>

      {/* Stage Name */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-2"
      >
        <p className={`text-lg font-semibold bg-gradient-to-r ${currentStage.color} bg-clip-text text-transparent`}>
          {currentStage.name}
        </p>
      </motion.div>
    </div>
  );
};

export const PlantWateringAnimation = ({ isWatering }) => {
  return (
    <AnimatePresence>
      {isWatering && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none"
        >
          {/* Water Droplets */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                y: -20, 
                x: Math.random() * 100,
                opacity: 0 
              }}
              animate={{ 
                y: 100,
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 1.5,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 0.5
              }}
              className="absolute text-2xl"
              style={{ left: `${Math.random() * 100}%` }}
            >
              💧
            </motion.div>
          ))}
          
          {/* Ripple Effect */}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              repeatDelay: 0.3
            }}
            className="absolute top-1/2 left-1/2 w-20 h-20 border-2 border-blue-400 rounded-full"
            style={{ transform: 'translate(-50%, -50%)' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const PlantMoodIndicator = ({ mood, confidence }) => {
  const getMoodConfig = (mood) => {
    const configs = {
      happy: {
        emoji: '😊',
        color: 'from-green-400 to-emerald-500',
        bgColor: 'bg-green-100',
        textColor: 'text-green-600',
        animation: 'bounce'
      },
      thirsty: {
        emoji: '😰',
        color: 'from-yellow-400 to-orange-500',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-600',
        animation: 'pulse'
      },
      sad: {
        emoji: '😢',
        color: 'from-blue-400 to-indigo-500',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-600',
        animation: 'shake'
      },
      dying: {
        emoji: '💀',
        color: 'from-red-400 to-pink-500',
        bgColor: 'bg-red-100',
        textColor: 'text-red-600',
        animation: 'shake'
      }
    };
    
    return configs[mood] || configs.happy;
  };

  const config = getMoodConfig(mood);

  return (
    <motion.div
      className={`${config.bgColor} rounded-2xl p-4 border-2 border-opacity-30`}
      animate={{
        scale: config.animation === 'bounce' ? [1, 1.05, 1] : 1,
        x: config.animation === 'shake' ? [0, -2, 2, -2, 2, 0] : 0,
      }}
      transition={{
        duration: config.animation === 'bounce' ? 2 : 0.5,
        repeat: Infinity,
        repeatType: 'reverse'
      }}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-12 h-12 bg-gradient-to-r ${config.color} rounded-xl flex items-center justify-center`}>
          <span className="text-2xl">{config.emoji}</span>
        </div>
        <div>
          <p className={`font-semibold ${config.textColor} capitalize`}>
            {mood} Mood
          </p>
          <p className={`text-sm ${config.textColor} opacity-75`}>
            {Math.round(confidence * 100)}% confidence
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export const PlantCollectionCard = ({ plant, isUnlocked, onSelect }) => {
  const getRarityConfig = (rarity) => {
    const configs = {
      common: {
        color: 'from-gray-400 to-gray-500',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-600',
        borderColor: 'border-gray-300'
      },
      rare: {
        color: 'from-blue-400 to-blue-500',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-600',
        borderColor: 'border-blue-300'
      },
      epic: {
        color: 'from-purple-400 to-purple-500',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-600',
        borderColor: 'border-purple-300'
      },
      legendary: {
        color: 'from-yellow-400 to-orange-500',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-600',
        borderColor: 'border-yellow-300'
      }
    };
    
    return configs[rarity] || configs.common;
  };

  const config = getRarityConfig(plant.rarity);

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => isUnlocked && onSelect?.(plant)}
      className={`rounded-3xl p-6 border-2 transition-all duration-200 cursor-pointer ${
        isUnlocked 
          ? `${config.bgColor} ${config.borderColor} shadow-lg hover:shadow-xl` 
          : 'bg-gray-100 border-gray-200 opacity-60'
      }`}
    >
      <div className="text-center">
        <motion.div
          animate={isUnlocked ? {
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-6xl mb-4"
        >
          {plant.emoji}
        </motion.div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2">{plant.name}</h3>
        <p className="text-gray-600 mb-3 capitalize">{plant.type}</p>
        
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}>
          {plant.rarity}
        </div>
        
        {!isUnlocked && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.random() * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Complete tasks to unlock
            </p>
          </div>
        )}
        
        {isUnlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3"
          >
            <div className="flex items-center justify-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-600">Unlocked!</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default {
  PlantGrowthAnimation,
  PlantWateringAnimation,
  PlantMoodIndicator,
  PlantCollectionCard
};
