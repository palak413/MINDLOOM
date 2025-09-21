import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  Droplets, 
  Sun, 
  Wind, 
  Bug, 
  Shield, 
  Heart,
  Star,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export const PlantCareTips = () => {
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    {
      id: 1,
      title: "Watering Wisdom",
      description: "Water your plants when the top inch of soil feels dry. Overwatering can be just as harmful as underwatering!",
      icon: Droplets,
      color: "from-blue-400 to-cyan-500",
      bgColor: "bg-blue-100",
      emoji: "💧",
      tips: [
        "Check soil moisture with your finger",
        "Water in the morning for best absorption",
        "Use room temperature water",
        "Ensure proper drainage"
      ]
    },
    {
      id: 2,
      title: "Sunlight Secrets",
      description: "Most plants need 6-8 hours of indirect sunlight daily. Watch for signs of too much or too little light.",
      icon: Sun,
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-yellow-100",
      emoji: "☀️",
      tips: [
        "Rotate plants weekly for even growth",
        "Watch for leaf burn from direct sun",
        "Use grow lights in dark spaces",
        "Adjust position based on season"
      ]
    },
    {
      id: 3,
      title: "Pest Protection",
      description: "Keep your plants healthy by regularly checking for pests and treating them early with natural methods.",
      icon: Shield,
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-100",
      emoji: "🛡️",
      tips: [
        "Inspect leaves regularly",
        "Use neem oil for natural pest control",
        "Quarantine new plants",
        "Keep plants clean and dust-free"
      ]
    },
    {
      id: 4,
      title: "Growth Guidance",
      description: "Help your plants thrive with proper nutrition, pruning, and repotting when needed.",
      icon: Heart,
      color: "from-pink-400 to-rose-500",
      bgColor: "bg-pink-100",
      emoji: "🌱",
      tips: [
        "Fertilize during growing season",
        "Prune dead or damaged leaves",
        "Repot when roots outgrow container",
        "Provide support for climbing plants"
      ]
    },
    {
      id: 5,
      title: "Air & Environment",
      description: "Plants need good air circulation and the right humidity levels to stay healthy and happy.",
      icon: Wind,
      color: "from-purple-400 to-violet-500",
      bgColor: "bg-purple-100",
      emoji: "💨",
      tips: [
        "Ensure good air circulation",
        "Maintain 40-60% humidity",
        "Avoid drafts and heat sources",
        "Group plants for microclimate"
      ]
    }
  ];

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);
  };

  const currentTipData = tips[currentTip];

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          <span>Plant Care Tips</span>
        </h3>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={prevTip}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm text-gray-500 px-2">
            {currentTip + 1} / {tips.length}
          </span>
          <button
            onClick={nextTip}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentTip}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Tip Header */}
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 bg-gradient-to-r ${currentTipData.color} rounded-2xl flex items-center justify-center`}>
              <span className="text-3xl">{currentTipData.emoji}</span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-800">{currentTipData.title}</h4>
              <p className="text-gray-600">{currentTipData.description}</p>
            </div>
          </div>

          {/* Tip Details */}
          <div className={`${currentTipData.bgColor} rounded-2xl p-6`}>
            <h5 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>Pro Tips:</span>
            </h5>
            <ul className="space-y-2">
              {currentTipData.tips.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 text-gray-700"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex-shrink-0" />
                  <span>{tip}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2">
            {tips.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTip(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentTip
                    ? `bg-gradient-to-r ${currentTipData.color}`
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export const PlantProgressTracker = ({ plant }) => {
  const getProgressPercentage = () => {
    if (!plant) return 0;
    const maxPoints = plant.growthLevel * 100;
    return Math.min((plant.growthPoints / maxPoints) * 100, 100);
  };

  const getNextLevelPoints = () => {
    if (!plant) return 100;
    const currentLevelPoints = plant.growthLevel * 100;
    return currentLevelPoints - plant.growthPoints;
  };

  const progressPercentage = getProgressPercentage();
  const nextLevelPoints = getNextLevelPoints();

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
        <TrendingUp className="w-6 h-6 text-green-500" />
        <span>Growth Progress</span>
      </h3>

      <div className="space-y-4">
        {/* Current Level */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Level {plant?.growthLevel || 1}</span>
          <span className="text-gray-600">Level {(plant?.growthLevel || 1) + 1}</span>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <motion.div
              className="bg-gradient-to-r from-green-400 to-emerald-500 h-4 rounded-full relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-white drop-shadow-lg">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>

        {/* Points Info */}
        <div className="text-center">
          <p className="text-gray-600">
            <span className="font-semibold text-green-600">{plant?.growthPoints || 0}</span> / 
            <span className="font-semibold text-gray-600">{(plant?.growthLevel || 1) * 100}</span> points
          </p>
          <p className="text-sm text-gray-500">
            {nextLevelPoints} points to next level
          </p>
        </div>

        {/* Growth Tips */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4">
          <h4 className="font-semibold text-green-800 mb-2">💡 Growth Tips:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Water your plant daily (+10 points)</li>
            <li>• Play music for your plant (+5 points)</li>
            <li>• Complete mini-games (+20 points)</li>
            <li>• Take photos (+15 points)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default {
  PlantCareTips,
  PlantProgressTracker
};
