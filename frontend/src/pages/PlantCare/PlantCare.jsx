import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Droplets, 
  Sun, 
  Cloud, 
  CloudRain, 
  Zap,
  TrendingUp,
  Heart,
  Calendar,
  Sparkles,
  Zap as Lightning
} from 'lucide-react';
import { plantAPI } from '../../services/api';
import toast from 'react-hot-toast';

const PlantCare = () => {
  const [plant, setPlant] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWatering, setIsWatering] = useState(false);
  const [lastWatered, setLastWatered] = useState(null);

  useEffect(() => {
    fetchPlant();
  }, []);

  const fetchPlant = async () => {
    setIsLoading(true);
    try {
      const response = await plantAPI.getPlant();
      setPlant(response.data.data);
      setLastWatered(response.data.data?.lastWatered);
    } catch (error) {
      console.error('Error fetching plant:', error);
      // Create a default plant if none exists
      setPlant({
        growthPoints: 0,
        growthLevel: 1,
        healthStatus: 'healthy',
        lastWatered: new Date(),
        weather: 'sunny'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWaterPlant = async () => {
    setIsWatering(true);
    try {
      const response = await plantAPI.waterPlant();
      setPlant(prev => ({
        ...prev,
        growthPoints: prev.growthPoints + 10,
        lastWatered: new Date(),
        healthStatus: 'healthy'
      }));
      setLastWatered(new Date());
      toast.success('Plant watered! +10 growth points');
    } catch (error) {
      toast.error('Failed to water plant');
    } finally {
      setIsWatering(false);
    }
  };

  const getWeatherIcon = (weather) => {
    switch (weather) {
      case 'sunny': return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'cloudy': return <Cloud className="w-6 h-6 text-gray-500" />;
      case 'rainy': return <CloudRain className="w-6 h-6 text-blue-500" />;
      case 'stormy': return <Zap className="w-6 h-6 text-purple-500" />;
      default: return <Sun className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'pale': return 'text-yellow-600';
      case 'wilting': return 'text-red-600';
      default: return 'text-green-600';
    }
  };

  const getPlantSize = (level) => {
    return Math.min(level * 30 + 60, 180); // Max size 180px
  };

  const getPlantColor = (level) => {
    if (level >= 5) return 'from-emerald-400 to-green-600';
    if (level >= 3) return 'from-green-400 to-emerald-500';
    return 'from-lime-400 to-green-500';
  };

  const getPotColor = (level) => {
    if (level >= 5) return 'from-amber-600 to-orange-700';
    if (level >= 3) return 'from-amber-500 to-orange-600';
    return 'from-yellow-600 to-amber-600';
  };

  const canWater = () => {
    if (!lastWatered) return true;
    const hoursSinceWatered = (new Date() - new Date(lastWatered)) / (1000 * 60 * 60);
    return hoursSinceWatered >= 1; // Can water every hour
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Leaf className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Plant Care</h1>
            <p className="text-gray-600">Nurture your virtual companion</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Sparkles className="w-4 h-4" />
          <span>Level {plant?.growthLevel || 1}</span>
        </div>
      </div>

      {/* Advanced 3D Plant Display - FAB Style */}
      <motion.div 
        className="card overflow-hidden relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '500px'
        }}
      >
        {/* 3D Environment Background */}
        <div className="absolute inset-0">
          {/* Sky Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-blue-100 to-green-100 opacity-60"></div>
          
          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
          
          {/* Light Rays */}
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-px bg-gradient-to-b from-yellow-200 to-transparent opacity-40"
                style={{
                  height: '200px',
                  left: `${20 + i * 15}%`,
                  top: '0',
                  transformOrigin: 'top',
                  transform: `rotate(${-30 + i * 15}deg)`
                }}
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  scaleY: [1, 1.2, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              />
            ))}
          </div>
        </div>

        {/* 3D Plant Scene */}
        <div className="relative z-10 text-center py-8">
          {/* Plant Container with 3D Perspective */}
          <div 
            className="mx-auto mb-8 relative"
            style={{ 
              width: '300px',
              height: '350px',
              perspective: '1000px'
            }}
          >
            {/* 3D Pot with Realistic Materials */}
            <motion.div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
              style={{
                width: '120px',
                height: '80px',
                transformStyle: 'preserve-3d'
              }}
              animate={{ 
                rotateY: [0, 5, -5, 0],
                rotateX: [0, 2, -2, 0]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              {/* Pot Base */}
              <div 
                className="absolute inset-0 rounded-b-2xl"
                style={{
                  background: `linear-gradient(145deg, 
                    ${getPotColor(plant?.growthLevel || 1).split(' ')[1]} 0%, 
                    ${getPotColor(plant?.growthLevel || 1).split(' ')[3]} 50%, 
                    ${getPotColor(plant?.growthLevel || 1).split(' ')[1]} 100%)`,
                  boxShadow: `
                    inset 0 4px 8px rgba(0,0,0,0.3),
                    inset 0 -2px 4px rgba(255,255,255,0.2),
                    0 12px 24px rgba(0,0,0,0.4),
                    0 0 0 1px rgba(0,0,0,0.1)
                  `,
                  transform: 'translateZ(0px)'
                }}
              />
              
              {/* Pot Rim with Metallic Effect */}
              <div 
                className="absolute top-0 left-0 right-0 h-4 rounded-t-2xl"
                style={{
                  background: `linear-gradient(135deg, 
                    #fbbf24 0%, 
                    #f59e0b 25%, 
                    #d97706 50%, 
                    #b45309 75%, 
                    #92400e 100%)`,
                  boxShadow: `
                    inset 0 2px 4px rgba(255,255,255,0.3),
                    inset 0 -1px 2px rgba(0,0,0,0.2),
                    0 2px 8px rgba(0,0,0,0.3)
                  `,
                  transform: 'translateZ(2px)'
                }}
              />
              
              {/* Pot Inner Shadow */}
              <div 
                className="absolute top-4 left-2 right-2 bottom-2 rounded-b-xl"
                style={{
                  background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.4) 100%)',
                  transform: 'translateZ(-1px)'
                }}
              />
            </motion.div>
            
            {/* 3D Plant Stem with Realistic Texture */}
            <motion.div 
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
              style={{
                width: '8px',
                height: '120px',
                background: `linear-gradient(to top, 
                  #166534 0%, 
                  #15803d 20%, 
                  #16a34a 40%, 
                  #22c55e 60%, 
                  #4ade80 80%, 
                  #86efac 100%)`,
                borderRadius: '4px',
                boxShadow: `
                  2px 0 8px rgba(0,0,0,0.3),
                  -2px 0 8px rgba(0,0,0,0.3),
                  inset 1px 0 2px rgba(255,255,255,0.2),
                  inset -1px 0 2px rgba(0,0,0,0.2)
                `,
                transform: 'translateZ(1px)'
              }}
              animate={{ 
                rotate: [0, 1, -1, 0],
                scale: [1, 1.02, 1]
              }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            
            {/* Advanced 3D Leaves with Realistic Shading */}
            <motion.div 
              className="absolute top-16 left-1/2 transform -translate-x-1/2"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ 
                rotate: [0, 2, -2, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 7, repeat: Infinity }}
            >
              {/* Main Central Leaf */}
              <motion.div 
                className="absolute left-1/2 top-0 transform -translate-x-1/2"
                style={{
                  width: '80px',
                  height: '80px',
                  background: `radial-gradient(ellipse at 30% 30%, 
                    rgba(255,255,255,0.4) 0%, 
                    transparent 50%), 
                    linear-gradient(135deg, 
                    ${getPlantColor(plant?.growthLevel || 1).split(' ')[1]} 0%, 
                    ${getPlantColor(plant?.growthLevel || 1).split(' ')[3]} 100%)`,
                  borderRadius: '50% 20% 50% 20%',
                  boxShadow: `
                    0 8px 32px rgba(0,0,0,0.3),
                    inset 0 2px 8px rgba(255,255,255,0.3),
                    inset 0 -2px 4px rgba(0,0,0,0.2),
                    0 0 0 1px rgba(0,0,0,0.1)
                  `,
                  transform: 'translateZ(2px) rotateX(10deg)'
                }}
                animate={{
                  rotateX: [10, 15, 10],
                  rotateY: [0, 5, 0]
                }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                {/* Leaf Veins */}
                <div className="absolute inset-4 border border-green-300 rounded-full opacity-20"></div>
                <div className="absolute inset-6 border border-green-200 rounded-full opacity-15"></div>
                <div className="absolute inset-8 border border-green-100 rounded-full opacity-10"></div>
              </motion.div>
              
              {/* Side Leaves with Individual Animation */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    width: '50px',
                    height: '50px',
                    left: `${i < 2 ? -30 : 30}px`,
                    top: `${i % 2 === 0 ? -10 : 20}px`,
                    background: `radial-gradient(ellipse at 30% 30%, 
                      rgba(255,255,255,0.3) 0%, 
                      transparent 50%), 
                      linear-gradient(135deg, 
                      #4ade80 0%, 
                      #059669 100%)`,
                    borderRadius: '50% 20% 50% 20%',
                    boxShadow: `
                      0 4px 16px rgba(0,0,0,0.2),
                      inset 0 1px 4px rgba(255,255,255,0.2),
                      inset 0 -1px 2px rgba(0,0,0,0.1)
                    `,
                    transform: `translateZ(${1 + i * 0.5}px) rotateX(${10 + i * 5}deg) rotateY(${i < 2 ? -15 : 15}deg)`
                  }}
                  animate={{ 
                    rotate: [0, i % 2 === 0 ? -3 : 3, 0],
                    scale: [1, 1.03, 1],
                    rotateX: [10 + i * 5, 15 + i * 5, 10 + i * 5]
                  }}
                  transition={{ 
                    duration: 6 + i, 
                    repeat: Infinity,
                    delay: i * 0.5
                  }}
                />
              ))}
            </motion.div>
            
            {/* Growth Sparkles with Enhanced Effects */}
            {plant?.growthLevel > 1 && (
              <motion.div 
                className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 180, 360],
                  scale: [1, 1.3, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-10 h-10 text-yellow-300 drop-shadow-2xl" />
                {/* Additional Sparkle Particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                    style={{
                      left: `${Math.cos(i * 60 * Math.PI / 180) * 20}px`,
                      top: `${Math.sin(i * 60 * Math.PI / 180) * 20}px`
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </motion.div>
            )}
            
            {/* Health Indicator with Pulse Effect */}
            <motion.div 
              className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full ${getHealthColor(plant?.healthStatus || 'healthy')}`}
              style={{
                boxShadow: `0 0 20px ${getHealthColor(plant?.healthStatus || 'healthy').replace('text-', '')}`,
                filter: 'blur(1px)'
              }}
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7],
                boxShadow: [
                  `0 0 20px ${getHealthColor(plant?.healthStatus || 'healthy').replace('text-', '')}`,
                  `0 0 30px ${getHealthColor(plant?.healthStatus || 'healthy').replace('text-', '')}`,
                  `0 0 20px ${getHealthColor(plant?.healthStatus || 'healthy').replace('text-', '')}`
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          
          {/* Plant Info with Enhanced Typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
              Your Wellness Plant
            </h2>
            <p className="text-blue-100 mb-6 text-lg drop-shadow-md">
              Nurture your digital companion with care and mindfulness
            </p>
          </motion.div>
          
          {/* Plant Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div 
              className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.3)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm text-blue-100">Growth Points</p>
              <p className="text-2xl font-bold text-white">{plant?.growthPoints || 0}</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.3)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center mb-2">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm text-blue-100">Health</p>
              <p className={`text-lg font-semibold capitalize text-white`}>
                {plant?.healthStatus || 'healthy'}
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.3)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center mb-2">
                {getWeatherIcon(plant?.weather || 'sunny')}
              </div>
              <p className="text-sm text-blue-100">Weather</p>
              <p className="text-lg font-semibold capitalize text-white">
                {plant?.weather || 'sunny'}
              </p>
            </motion.div>
          </div>

          {/* Water Plant Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.button
              onClick={handleWaterPlant}
              disabled={!canWater() || isWatering}
              className={`relative overflow-hidden px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 ${
                !canWater() || isWatering
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl'
              }`}
              whileHover={!isWatering && canWater() ? { scale: 1.05 } : {}}
              whileTap={!isWatering && canWater() ? { scale: 0.95 } : {}}
            >
              {/* Water Effect */}
              {isWatering && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400"
                  animate={{ 
                    background: [
                      'linear-gradient(90deg, #60a5fa 0%, #22d3ee 100%)',
                      'linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)',
                      'linear-gradient(90deg, #60a5fa 0%, #22d3ee 100%)'
                    ]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
              
              <div className="relative z-10 flex items-center space-x-3">
                {isWatering ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Droplets className="w-6 h-6" />
                    </motion.div>
                    <span>Watering...</span>
                  </>
                ) : (
                  <>
                    <Droplets className="w-6 h-6" />
                    <span>Water Plant</span>
                  </>
                )}
              </div>
            </motion.button>
          </motion.div>

          {!canWater() && (
            <p className="text-sm text-blue-100 mt-2">
              Plant was recently watered. Try again in a bit!
            </p>
          )}
        </div>
      </motion.div>

      {/* Plant Care Tips */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Plant Care Tips</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 text-sm">1</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Complete Tasks</p>
              <p className="text-sm text-gray-600">Each completed task gives your plant growth points</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-sm">2</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Write Journal Entries</p>
              <p className="text-sm text-gray-600">Journaling helps your plant grow and stay healthy</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-purple-600 text-sm">3</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Water Regularly</p>
              <p className="text-sm text-gray-600">Water your plant to keep it healthy and growing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Last Watered Info */}
      {lastWatered && (
        <div className="card">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              Last watered: {new Date(lastWatered).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantCare;
