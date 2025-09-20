import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../components/Icons/IconSystem';
import { storeAPI } from '../../services/api';
import useAuthStore from '../../stores/authStore';
import toast from 'react-hot-toast';

const Store = () => {
  const { user, setUser } = useAuthStore();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState({});
  const [filter, setFilter] = useState('all');
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    fetchItems();
    fetchInventory();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await storeAPI.getItems();
      setItems(response.data.data || []);
    } catch (error) {
      // Use mock data if API fails
      const mockItems = [
        {
          _id: '1',
          name: "Classic Terracotta Pot",
          description: "A timeless terracotta pot that gives your plant a natural, earthy look. Perfect for any plant type.",
          price: 50,
          category: "plant-pot",
          rarity: "common",
          effects: { "growthBoost": 5 },
          imageUrl: "🏺"
        },
        {
          _id: '2',
          name: "Ceramic Rainbow Pot",
          description: "A beautiful ceramic pot with rainbow glaze. Adds color and joy to your plant collection.",
          price: 120,
          category: "plant-pot",
          rarity: "rare",
          effects: { "moodBoost": 10, "growthBoost": 8 },
          imageUrl: "🌈"
        },
        {
          _id: '3',
          name: "Golden Luxury Pot",
          description: "An elegant golden pot that makes your plant look like royalty. Limited edition item.",
          price: 300,
          category: "plant-pot",
          rarity: "epic",
          effects: { "growthBoost": 15, "moodBoost": 20, "prestige": 25 },
          imageUrl: "👑"
        },
        {
          _id: '4',
          name: "Fairy Lights",
          description: "Twinkling fairy lights that create a magical atmosphere around your plant.",
          price: 80,
          category: "plant-decor",
          rarity: "common",
          effects: { "moodBoost": 15, "coziness": 20 },
          imageUrl: "✨"
        },
        {
          _id: '5',
          name: "Mini Garden Gnome",
          description: "A cute garden gnome that watches over your plant and brings good luck.",
          price: 100,
          category: "plant-decor",
          rarity: "rare",
          effects: { "luck": 10, "moodBoost": 12 },
          imageUrl: "🧙‍♂️"
        },
        {
          _id: '6',
          name: "Organic Plant Food",
          description: "Nutritious organic food that helps your plant grow faster and healthier.",
          price: 60,
          category: "plant-food",
          rarity: "common",
          effects: { "growthBoost": 12, "health": 10 },
          imageUrl: "🌿"
        },
        {
          _id: '7',
          name: "Smart Moisture Meter",
          description: "An advanced tool that monitors soil moisture and alerts you when watering is needed.",
          price: 120,
          category: "plant-tools",
          rarity: "rare",
          effects: { "wateringEfficiency": 25, "plantHealth": 20 },
          imageUrl: "📊"
        },
        {
          _id: '8',
          name: "Plant Whisperer's Ring",
          description: "A magical ring that enhances your connection with plants. Legendary item.",
          price: 400,
          category: "accessories",
          rarity: "legendary",
          effects: { "plantConnection": 40, "growthBoost": 20, "moodBoost": 25, "prestige": 30 },
          imageUrl: "💍"
        },
        // More Plant Pots
        {
          _id: '9',
          name: "Vintage Copper Pot",
          description: "A beautiful vintage copper pot that adds rustic charm to your plant collection.",
          price: 180,
          category: "plant-pot",
          rarity: "rare",
          effects: { "growthBoost": 12, "beauty": 15, "vintage": 20 },
          imageUrl: "🪙"
        },
        {
          _id: '10',
          name: "Marble Elegance Pot",
          description: "A sophisticated marble pot that brings luxury and elegance to your space.",
          price: 250,
          category: "plant-pot",
          rarity: "epic",
          effects: { "growthBoost": 18, "elegance": 25, "prestige": 20 },
          imageUrl: "🏛️"
        },
        {
          _id: '11',
          name: "Bamboo Eco Pot",
          description: "An eco-friendly bamboo pot that's perfect for environmentally conscious plant parents.",
          price: 70,
          category: "plant-pot",
          rarity: "common",
          effects: { "growthBoost": 8, "ecoFriendly": 15, "sustainability": 20 },
          imageUrl: "🎋"
        },
        {
          _id: '12',
          name: "Crystal Geode Pot",
          description: "A stunning crystal geode pot that channels earth's natural energy to your plant.",
          price: 350,
          category: "plant-pot",
          rarity: "epic",
          effects: { "growthBoost": 22, "energy": 25, "healing": 18, "prestige": 30 },
          imageUrl: "🔮"
        },

        // More Decorations
        {
          _id: '13',
          name: "Butterfly Garden",
          description: "A collection of colorful butterflies that flutter around your plant, bringing life and joy.",
          price: 90,
          category: "plant-decor",
          rarity: "common",
          effects: { "moodBoost": 18, "joy": 20, "life": 15 },
          imageUrl: "🦋"
        },
        {
          _id: '14',
          name: "Mushroom Village",
          description: "A charming village of tiny mushrooms that creates a magical forest atmosphere.",
          price: 130,
          category: "plant-decor",
          rarity: "rare",
          effects: { "moodBoost": 20, "magic": 25, "coziness": 22 },
          imageUrl: "🍄"
        },
        {
          _id: '15',
          name: "Solar Garden Lights",
          description: "Beautiful solar-powered lights that illuminate your plant garden at night.",
          price: 110,
          category: "plant-decor",
          rarity: "rare",
          effects: { "moodBoost": 16, "illumination": 20, "nightBeauty": 18 },
          imageUrl: "💡"
        },
        {
          _id: '16',
          name: "Floating Orbs",
          description: "Mystical floating orbs that hover around your plant, creating an otherworldly atmosphere.",
          price: 200,
          category: "plant-decor",
          rarity: "epic",
          effects: { "moodBoost": 25, "mystery": 30, "prestige": 20, "magic": 25 },
          imageUrl: "🔮"
        },

        // More Plant Food
        {
          _id: '17',
          name: "Liquid Sunshine",
          description: "A special formula that captures the essence of sunlight for your plant's growth.",
          price: 85,
          category: "plant-food",
          rarity: "common",
          effects: { "growthBoost": 15, "sunlight": 20, "energy": 18 },
          imageUrl: "☀️"
        },
        {
          _id: '18',
          name: "Moonlight Elixir",
          description: "A mystical elixir made from moonlight that helps plants grow during the night.",
          price: 160,
          category: "plant-food",
          rarity: "rare",
          effects: { "growthBoost": 18, "moonlight": 25, "mystery": 20 },
          imageUrl: "🌙"
        },
        {
          _id: '19',
          name: "Rainbow Nutrients",
          description: "Colorful nutrient crystals that provide all essential elements for vibrant plant growth.",
          price: 140,
          category: "plant-food",
          rarity: "rare",
          effects: { "growthBoost": 20, "vibrancy": 25, "health": 22 },
          imageUrl: "🌈"
        },
        {
          _id: '20',
          name: "Divine Ambrosia",
          description: "The ultimate plant food, said to be blessed by nature spirits themselves.",
          price: 300,
          category: "plant-food",
          rarity: "legendary",
          effects: { "growthBoost": 35, "divine": 40, "perfection": 30, "prestige": 35 },
          imageUrl: "✨"
        },

        // More Tools
        {
          _id: '21',
          name: "Plant Care Kit",
          description: "A complete set of tools for professional plant care and maintenance.",
          price: 95,
          category: "plant-tools",
          rarity: "common",
          effects: { "plantHealth": 20, "careEfficiency": 25, "organization": 15 },
          imageUrl: "🛠️"
        },
        {
          _id: '22',
          name: "Digital Plant Monitor",
          description: "An advanced device that tracks all aspects of your plant's health in real-time.",
          price: 180,
          category: "plant-tools",
          rarity: "rare",
          effects: { "plantHealth": 30, "monitoring": 35, "technology": 25 },
          imageUrl: "📱"
        },
        {
          _id: '23',
          name: "Automatic Watering System",
          description: "A smart system that automatically waters your plant at the perfect time.",
          price: 220,
          category: "plant-tools",
          rarity: "epic",
          effects: { "wateringEfficiency": 40, "automation": 35, "convenience": 30 },
          imageUrl: "🚰"
        },
        {
          _id: '24',
          name: "Plant Growth Accelerator",
          description: "A revolutionary device that uses advanced technology to accelerate plant growth.",
          price: 400,
          category: "plant-tools",
          rarity: "legendary",
          effects: { "growthBoost": 50, "technology": 45, "innovation": 40, "prestige": 35 },
          imageUrl: "⚡"
        },

        // More Room Decor
        {
          _id: '25',
          name: "Plant Wall Art",
          description: "Beautiful wall art featuring botanical illustrations that complement your plants.",
          price: 75,
          category: "room-decor",
          rarity: "common",
          effects: { "beauty": 20, "artistic": 18, "inspiration": 15 },
          imageUrl: "🖼️"
        },
        {
          _id: '26',
          name: "Aromatherapy Garden",
          description: "A collection of aromatic plants and essential oils that create a healing atmosphere.",
          price: 150,
          category: "room-decor",
          rarity: "rare",
          effects: { "relaxation": 30, "healing": 25, "aromatherapy": 28 },
          imageUrl: "🌸"
        },
        {
          _id: '27',
          name: "Zen Water Feature",
          description: "A peaceful water feature that creates soothing sounds and adds tranquility to your space.",
          price: 200,
          category: "room-decor",
          rarity: "epic",
          effects: { "relaxation": 35, "tranquility": 30, "zen": 25, "prestige": 20 },
          imageUrl: "🌊"
        },
        {
          _id: '28',
          name: "Celestial Garden",
          description: "A magical garden setup that brings the cosmos to your plant space.",
          price: 350,
          category: "room-decor",
          rarity: "legendary",
          effects: { "mystery": 40, "cosmic": 35, "magic": 30, "prestige": 40 },
          imageUrl: "🌌"
        },

        // More Accessories
        {
          _id: '29',
          name: "Plant Care Calendar",
          description: "A beautiful calendar to track your plant care schedule and growth milestones.",
          price: 25,
          category: "accessories",
          rarity: "common",
          effects: { "organization": 20, "planning": 18, "consistency": 15 },
          imageUrl: "📅"
        },
        {
          _id: '30',
          name: "Plant Parent Certificate",
          description: "An official certificate recognizing your dedication to plant parenting.",
          price: 60,
          category: "accessories",
          rarity: "common",
          effects: { "prestige": 15, "achievement": 20, "recognition": 18 },
          imageUrl: "📜"
        },
        {
          _id: '31',
          name: "Mystical Plant Guide",
          description: "An ancient book containing secrets of plant care and magical gardening techniques.",
          price: 180,
          category: "accessories",
          rarity: "rare",
          effects: { "knowledge": 30, "wisdom": 25, "mystery": 20, "learning": 28 },
          imageUrl: "📚"
        },
        {
          _id: '32',
          name: "Nature Spirit Totem",
          description: "A sacred totem that connects you with nature spirits and enhances plant communication.",
          price: 300,
          category: "accessories",
          rarity: "epic",
          effects: { "spiritConnection": 35, "nature": 30, "communication": 25, "prestige": 30 },
          imageUrl: "🗿"
        },
        {
          _id: '33',
          name: "Eternal Plant Guardian",
          description: "A legendary guardian spirit that watches over your plants and ensures their eternal health.",
          price: 500,
          category: "accessories",
          rarity: "legendary",
          effects: { "protection": 50, "eternal": 45, "guardian": 40, "prestige": 50, "divine": 35 },
          imageUrl: "👼"
        },

        // Special Limited Items
        {
          _id: '34',
          name: "Spring Festival Pot",
          description: "A limited edition pot celebrating the spring season with blooming flower designs.",
          price: 200,
          category: "plant-pot",
          rarity: "epic",
          effects: { "growthBoost": 20, "spring": 25, "festival": 20, "limited": 30 },
          imageUrl: "🌸"
        },
        {
          _id: '35',
          name: "Halloween Spooky Decor",
          description: "Spooky decorations perfect for Halloween, featuring pumpkins and ghostly elements.",
          price: 120,
          category: "plant-decor",
          rarity: "rare",
          effects: { "moodBoost": 15, "spooky": 20, "halloween": 25, "fun": 18 },
          imageUrl: "🎃"
        },
        {
          _id: '36',
          name: "Christmas Magic Set",
          description: "A magical Christmas set with twinkling lights and festive decorations for your plants.",
          price: 180,
          category: "plant-decor",
          rarity: "epic",
          effects: { "moodBoost": 25, "christmas": 30, "magic": 25, "festive": 28 },
          imageUrl: "🎄"
        }
      ];
      setItems(mockItems);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInventory = async () => {
    try {
      // Mock inventory for demo
      setInventory([]);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const handlePurchase = async (itemId) => {
    setIsPurchasing(prev => ({ ...prev, [itemId]: true }));
    try {
      const response = await storeAPI.buyItem(itemId);
      const updatedPoints = response.data.data.points;
      
      // Update user points
      setUser({ ...user, points: updatedPoints });
      
      // Add to inventory
      const purchasedItem = items.find(item => item._id === itemId);
      setInventory(prev => [...prev, purchasedItem]);
      
      toast.success('Item purchased successfully! 🌱');
    } catch (error) {
      // Mock purchase for demo
      const purchasedItem = items.find(item => item._id === itemId);
      if (purchasedItem && (user?.points || 0) >= purchasedItem.price) {
        setUser({ ...user, points: (user?.points || 0) - purchasedItem.price });
        setInventory(prev => [...prev, purchasedItem]);
        toast.success('Item purchased successfully! 🌱');
      } else {
        toast.error('Not enough points!');
      }
    } finally {
      setIsPurchasing(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const isOwned = (itemId) => {
    return inventory.some(item => item._id === itemId);
  };

  const canAfford = (price) => {
    return (user?.points || 0) >= price;
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityIcon = (rarity) => {
    switch (rarity) {
      case 'common': return '⭐';
      case 'rare': return '💎';
      case 'epic': return '👑';
      case 'legendary': return '🌟';
      default: return '⭐';
    }
  };

  const getCategoryInfo = (category) => {
    switch (category) {
      case 'plant-pot': return { name: 'Plant Pots', icon: '🏺', color: 'bg-emerald-500' };
      case 'plant-decor': return { name: 'Decorations', icon: '✨', color: 'bg-purple-500' };
      case 'plant-food': return { name: 'Plant Food', icon: '🌿', color: 'bg-green-500' };
      case 'plant-tools': return { name: 'Tools', icon: '🔧', color: 'bg-blue-500' };
      case 'room-decor': return { name: 'Room Decor', icon: '🏠', color: 'bg-pink-500' };
      case 'accessories': return { name: 'Accessories', icon: '💍', color: 'bg-orange-500' };
      default: return { name: 'Other', icon: '🎁', color: 'bg-gray-500' };
    }
  };

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'owned') return isOwned(item._id);
    if (filter === 'affordable') return item.price <= 100;
    if (filter === 'legendary') return item.rarity === 'legendary';
    if (filter === 'epic') return item.rarity === 'epic';
    return item.category === filter;
  });

  const categories = [
    { value: 'all', label: 'All Items', icon: '🛍️' },
    { value: 'plant-pot', label: 'Plant Pots', icon: '🏺' },
    { value: 'plant-decor', label: 'Decorations', icon: '✨' },
    { value: 'plant-food', label: 'Plant Food', icon: '🌿' },
    { value: 'plant-tools', label: 'Tools', icon: '🔧' },
    { value: 'room-decor', label: 'Room Decor', icon: '🏠' },
    { value: 'accessories', label: 'Accessories', icon: '💍' },
    { value: 'legendary', label: 'Legendary', icon: '🌟' },
    { value: 'epic', label: 'Epic Items', icon: '👑' },
    { value: 'affordable', label: 'Under 100', icon: '💰' },
    { value: 'owned', label: 'Owned', icon: '✅' }
  ];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center">
            <Icon name="store" size="lg" className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Plant Store</h1>
            <p className="text-gray-600">Enhance your plant collection with beautiful items</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-xl shadow-lg">
          <Icon name="star" size="md" className="text-white" />
          <span className="font-bold text-lg">{user?.points || 0} Points</span>
        </div>
      </motion.div>

      {/* Filter */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center space-x-4 mb-4">
          <Icon name="search" size="md" className="text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-800">Browse Categories</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <motion.button
              key={category.value}
              onClick={() => setFilter(category.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                filter === category.value
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Featured Items */}
      <motion.div
        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">🌟 Featured Items</h3>
          <p className="text-gray-600">Special items that are trending right now!</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Most Popular */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-center">
              <div className="text-4xl mb-3">🔥</div>
              <h4 className="font-bold text-gray-800 mb-2">Most Popular</h4>
              <p className="text-sm text-gray-600 mb-3">Fairy Lights</p>
              <div className="text-yellow-600 font-bold">80 points</div>
            </div>
          </div>
          
          {/* New Arrival */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-center">
              <div className="text-4xl mb-3">✨</div>
              <h4 className="font-bold text-gray-800 mb-2">New Arrival</h4>
              <p className="text-sm text-gray-600 mb-3">Eternal Plant Guardian</p>
              <div className="text-yellow-600 font-bold">500 points</div>
            </div>
          </div>
          
          {/* Best Value */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-center">
              <div className="text-4xl mb-3">💎</div>
              <h4 className="font-bold text-gray-800 mb-2">Best Value</h4>
              <p className="text-sm text-gray-600 mb-3">Plant Care Calendar</p>
              <div className="text-yellow-600 font-bold">25 points</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Store Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </motion.div>
          ))
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item, index) => {
            const owned = isOwned(item._id);
            const affordable = canAfford(item.price);
            const categoryInfo = getCategoryInfo(item.category);
            
            return (
              <motion.div
                key={item._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Item Image */}
                <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                  <div className="text-8xl">{item.imageUrl}</div>
                  
                  {/* Rarity Badge */}
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${getRarityColor(item.rarity)}`}>
                    <span className="mr-1">{getRarityIcon(item.rarity)}</span>
                    {item.rarity}
                  </div>
                  
                  {/* Category Badge */}
                  <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold text-white ${categoryInfo.color}`}>
                    {categoryInfo.icon} {categoryInfo.name}
                  </div>
                </div>

                {/* Item Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                  
                  {/* Effects */}
                  {item.effects && Object.keys(item.effects).length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-gray-500 mb-2">Effects:</div>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(item.effects).map(([effect, value]) => (
                          <span key={effect} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {effect}: +{value}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1 text-yellow-600">
                      <Icon name="star" size="sm" />
                      <span className="font-bold text-lg">{item.price}</span>
                    </div>
                    {owned && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <Icon name="check" size="sm" />
                        <span className="text-sm font-medium">Owned</span>
                      </div>
                    )}
                  </div>

                  {/* Purchase Button */}
                  <motion.button
                    onClick={() => handlePurchase(item._id)}
                    disabled={owned || !affordable || isPurchasing[item._id]}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                      owned
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : !affordable
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg'
                    }`}
                    whileHover={!owned && affordable ? { scale: 1.02 } : {}}
                    whileTap={!owned && affordable ? { scale: 0.98 } : {}}
                  >
                    {isPurchasing[item._id] ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Purchasing...</span>
                      </>
                    ) : owned ? (
                      <>
                        <Icon name="check" size="sm" />
                        <span>Owned</span>
                      </>
                    ) : !affordable ? (
                      <>
                        <Icon name="star" size="sm" />
                        <span>Need {item.price - (user?.points || 0)} more points</span>
                      </>
                    ) : (
                      <>
                        <Icon name="add" size="sm" />
                        <span>Buy Now</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            );
          })
        ) : (
          <motion.div
            className="col-span-full text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-8xl mb-4">🛍️</div>
            <h3 className="text-2xl font-bold text-gray-500 mb-2">No items found</h3>
            <p className="text-gray-400 text-lg">
              {filter === 'owned' 
                ? "You haven't purchased any items yet." 
                : "No items match your current filter."
              }
            </p>
          </motion.div>
        )}
      </div>

      {/* How to Earn Points */}
      <motion.div
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">How to Earn Points</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="check" size="lg" className="text-blue-600" />
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Complete Tasks</h4>
            <p className="text-sm text-gray-600">+10 points per task</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="journal" size="lg" className="text-green-600" />
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Write Journal</h4>
            <p className="text-sm text-gray-600">+10 points per entry</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="breathing" size="lg" className="text-purple-600" />
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Breathing Exercises</h4>
            <p className="text-sm text-gray-600">+1 point per second</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="mood" size="lg" className="text-pink-600" />
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Track Mood</h4>
            <p className="text-sm text-gray-600">+5 points per entry</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Store;
