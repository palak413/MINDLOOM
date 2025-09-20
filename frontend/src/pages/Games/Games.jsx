import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, 
  Brain, 
  Heart, 
  Zap, 
  Star, 
  Trophy,
  Play,
  Target,
  Sparkles,
  Smile,
  Music,
  Puzzle
} from 'lucide-react';
import useAuthStore from '../../stores/authStore';

const Games = () => {
  const { user } = useAuthStore();
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: 'mood-match',
      title: 'Mood Match',
      description: 'Match emotions with activities to boost your mood',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      difficulty: 'Easy',
      duration: '5 min',
      points: 50,
      category: 'Emotional'
    },
    {
      id: 'breathing-challenge',
      title: 'Breathing Challenge',
      description: 'Master breathing techniques through interactive challenges',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      difficulty: 'Medium',
      duration: '10 min',
      points: 75,
      category: 'Mindfulness'
    },
    {
      id: 'memory-garden',
      title: 'Memory Garden',
      description: 'Grow your virtual garden by completing memory exercises',
      icon: Brain,
      color: 'from-green-500 to-emerald-500',
      difficulty: 'Hard',
      duration: '15 min',
      points: 100,
      category: 'Cognitive'
    },
    {
      id: 'gratitude-hunt',
      title: 'Gratitude Hunt',
      description: 'Find and collect gratitude moments throughout your day',
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      difficulty: 'Easy',
      duration: '8 min',
      points: 60,
      category: 'Positive'
    },
    {
      id: 'stress-buster',
      title: 'Stress Buster',
      description: 'Pop stress bubbles and learn relaxation techniques',
      icon: Target,
      color: 'from-purple-500 to-violet-500',
      difficulty: 'Easy',
      duration: '6 min',
      points: 40,
      category: 'Relaxation'
    },
    {
      id: 'mindfulness-maze',
      title: 'Mindfulness Maze',
      description: 'Navigate through calming mazes while practicing mindfulness',
      icon: Puzzle,
      color: 'from-indigo-500 to-purple-500',
      difficulty: 'Medium',
      duration: '12 min',
      points: 80,
      category: 'Focus'
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const startGame = (game) => {
    setSelectedGame(game);
  };

  const closeGame = () => {
    setSelectedGame(null);
  };

  if (selectedGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={closeGame}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                ←
              </div>
              <span className="font-medium">Back to Games</span>
            </button>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Points</div>
                <div className="text-lg font-bold text-gray-800">{user?.points || 0}</div>
              </div>
            </div>
          </div>

          {/* Game Content */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl">
            <div className="text-center mb-8">
              <div className={`w-20 h-20 bg-gradient-to-br ${selectedGame.color} rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                <selectedGame.icon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{selectedGame.title}</h1>
              <p className="text-gray-600 text-lg">{selectedGame.description}</p>
            </div>

            {/* Game-specific content */}
            {selectedGame.id === 'mood-match' && <MoodMatchGame />}
            {selectedGame.id === 'breathing-challenge' && <BreathingChallengeGame />}
            {selectedGame.id === 'memory-garden' && <MemoryGardenGame />}
            {selectedGame.id === 'gratitude-hunt' && <GratitudeHuntGame />}
            {selectedGame.id === 'stress-buster' && <StressBusterGame />}
            {selectedGame.id === 'mindfulness-maze' && <MindfulnessMazeGame />}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-cyan-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div 
        className="relative p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-lg">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Wellness Games
              </h1>
              <p className="text-gray-600 text-lg">Play, learn, and boost your mood!</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-gray-800">{user?.points || 0} Points</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-2">
              <Trophy className="w-5 h-5 text-orange-500" />
              <span className="font-semibold text-gray-800">Level {Math.floor((user?.points || 0) / 100) + 1}</span>
            </div>
          </div>
        </motion.div>

        {/* Games Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {games.map((game, index) => {
            const Icon = game.icon;
            return (
              <motion.div
                key={game.id}
                className="group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative p-6">
                  {/* Game Icon and Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 text-xs rounded-full font-medium ${getDifficultyColor(game.difficulty)}`}>
                        {game.difficulty}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{game.duration}</div>
                    </div>
                  </div>

                  {/* Game Details */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {game.description}
                    </p>
                  </div>

                  {/* Category and Points */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                      {game.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-semibold text-gray-800">{game.points} pts</span>
                    </div>
                  </div>

                  {/* Play Button */}
                  <motion.button
                    onClick={() => startGame(game)}
                    className={`w-full py-3 bg-gradient-to-r ${game.color} text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-5 h-5" />
                    <span>Play Now</span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Daily Challenge */}
        <motion.div
          className="max-w-4xl mx-auto mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Daily Challenge</h2>
                <p className="text-orange-100">Complete today's special game for bonus points!</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Mood Match Master</h3>
                <p className="text-orange-100 text-sm">Match 10 emotions with activities</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">+200</div>
                <div className="text-orange-100 text-sm">Bonus Points</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Game Components
const MoodMatchGame = () => {
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const emotions = [
    { id: 1, name: 'Happy', emoji: '😊', color: 'bg-yellow-100' },
    { id: 2, name: 'Sad', emoji: '😢', color: 'bg-blue-100' },
    { id: 3, name: 'Angry', emoji: '😠', color: 'bg-red-100' },
    { id: 4, name: 'Anxious', emoji: '😰', color: 'bg-purple-100' }
  ];

  const activities = [
    { id: 1, name: 'Take deep breaths', emotion: 'Anxious', correct: true },
    { id: 2, name: 'Listen to music', emotion: 'Sad', correct: true },
    { id: 3, name: 'Go for a walk', emotion: 'Angry', correct: true },
    { id: 4, name: 'Call a friend', emotion: 'Happy', correct: false }
  ];

  const currentEmotion = emotions[currentRound - 1];
  const correctActivity = activities.find(a => a.emotion === currentEmotion.name);

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
    const correct = activity.emotion === currentEmotion.name;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 10);
    }
    
    setTimeout(() => {
      if (currentRound < emotions.length) {
        setCurrentRound(currentRound + 1);
        setSelectedActivity(null);
        setIsCorrect(null);
      }
    }, 2000);
  };

  return (
    <div className="text-center">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Round {currentRound} of {emotions.length}</h3>
        <div className="text-3xl font-bold text-gray-600">Score: {score}</div>
      </div>

      <div className="mb-8">
        <div className={`w-24 h-24 ${currentEmotion.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
          <span className="text-4xl">{currentEmotion.emoji}</span>
        </div>
        <h4 className="text-2xl font-bold text-gray-800 mb-2">I feel {currentEmotion.name}</h4>
        <p className="text-gray-600">What activity would help improve this mood?</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {activities.map((activity) => (
          <motion.button
            key={activity.id}
            onClick={() => handleActivitySelect(activity)}
            className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
              selectedActivity?.id === activity.id
                ? isCorrect
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={selectedActivity !== null}
          >
            <div className="text-sm font-medium text-gray-800">{activity.name}</div>
          </motion.button>
        ))}
      </div>

      {selectedActivity && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
        >
          {isCorrect ? '✅ Correct! Great choice!' : '❌ Not quite right, but good thinking!'}
        </motion.div>
      )}
    </div>
  );
};

const BreathingChallengeGame = () => {
  const [phase, setPhase] = useState('inhale');
  const [count, setCount] = useState(4);
  const [isActive, setIsActive] = useState(false);

  const startBreathing = () => {
    setIsActive(true);
    const cycle = () => {
      setPhase('inhale');
      setTimeout(() => setPhase('hold'), 4000);
      setTimeout(() => setPhase('exhale'), 8000);
      setTimeout(() => setPhase('rest'), 12000);
    };
    cycle();
    const interval = setInterval(cycle, 16000);
    return () => clearInterval(interval);
  };

  return (
    <div className="text-center">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Breathing Challenge</h3>
        <p className="text-gray-600">Follow the breathing pattern to relax</p>
      </div>

      <div className="mb-8">
        <motion.div
          className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center text-white font-bold text-xl ${
            phase === 'inhale' ? 'bg-blue-500' :
            phase === 'hold' ? 'bg-green-500' :
            phase === 'exhale' ? 'bg-purple-500' :
            'bg-gray-500'
          }`}
          animate={{
            scale: phase === 'inhale' ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 4,
            repeat: phase === 'inhale' ? Infinity : 0
          }}
        >
          {phase === 'inhale' && 'Breathe In'}
          {phase === 'hold' && 'Hold'}
          {phase === 'exhale' && 'Breathe Out'}
          {phase === 'rest' && 'Rest'}
        </motion.div>
      </div>

      <div className="mb-8">
        <div className="text-2xl font-bold text-gray-800 mb-2">
          {phase === 'inhale' && 'Inhale slowly...'}
          {phase === 'hold' && 'Hold your breath...'}
          {phase === 'exhale' && 'Exhale gently...'}
          {phase === 'rest' && 'Take a moment...'}
        </div>
        <div className="text-gray-600">Round {Math.floor(count / 4) + 1}</div>
      </div>

      {!isActive && (
        <motion.button
          onClick={startBreathing}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Breathing Challenge
        </motion.button>
      )}
    </div>
  );
};

const MemoryGardenGame = () => {
  const [cards, setCards] = useState([
    { id: 1, emoji: '🌱', flipped: false, matched: false },
    { id: 2, emoji: '🌸', flipped: false, matched: false },
    { id: 3, emoji: '🌱', flipped: false, matched: false },
    { id: 4, emoji: '🌸', flipped: false, matched: false },
    { id: 5, emoji: '🌿', flipped: false, matched: false },
    { id: 6, emoji: '🌿', flipped: false, matched: false },
  ]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [score, setScore] = useState(0);

  const flipCard = (cardId) => {
    if (flippedCards.length >= 2) return;
    
    const newCards = cards.map(card => 
      card.id === cardId ? { ...card, flipped: true } : card
    );
    setCards(newCards);
    setFlippedCards([...flippedCards, cardId]);

    if (flippedCards.length === 1) {
      setTimeout(() => {
        const firstCard = cards.find(c => c.id === flippedCards[0]);
        const secondCard = cards.find(c => c.id === cardId);
        
        if (firstCard.emoji === secondCard.emoji) {
          const matchedCards = cards.map(card => 
            card.id === cardId || card.id === flippedCards[0] 
              ? { ...card, matched: true } 
              : card
          );
          setCards(matchedCards);
          setScore(score + 10);
        } else {
          const resetCards = cards.map(card => 
            card.id === cardId || card.id === flippedCards[0] 
              ? { ...card, flipped: false } 
              : card
          );
          setCards(resetCards);
        }
        setFlippedCards([]);
      }, 1000);
    }
  };

  return (
    <div className="text-center">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Memory Garden</h3>
        <p className="text-gray-600">Match the plant cards to grow your garden!</p>
        <div className="text-2xl font-bold text-gray-600 mt-2">Score: {score}</div>
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            onClick={() => flipCard(card.id)}
            className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
              card.flipped || card.matched
                ? 'bg-white border-gray-300'
                : 'bg-gray-200 border-gray-400 hover:bg-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={card.flipped || card.matched}
          >
            {card.flipped || card.matched ? card.emoji : '?'}
          </motion.button>
        ))}
      </div>

      {cards.every(card => card.matched) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 bg-green-100 text-green-800 rounded-2xl"
        >
          🌟 Congratulations! Your garden is complete!
        </motion.div>
      )}
    </div>
  );
};

const GratitudeHuntGame = () => {
  const [gratitudeItems, setGratitudeItems] = useState([
    { id: 1, text: 'A warm cup of coffee', found: false },
    { id: 2, text: 'A sunny day', found: false },
    { id: 3, text: 'A friend\'s smile', found: false },
    { id: 4, text: 'Good health', found: false },
    { id: 5, text: 'A comfortable home', found: false },
  ]);
  const [foundCount, setFoundCount] = useState(0);

  const findItem = (id) => {
    const updatedItems = gratitudeItems.map(item =>
      item.id === id ? { ...item, found: true } : item
    );
    setGratitudeItems(updatedItems);
    setFoundCount(foundCount + 1);
  };

  return (
    <div className="text-center">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Gratitude Hunt</h3>
        <p className="text-gray-600">Find things to be grateful for today!</p>
        <div className="text-2xl font-bold text-gray-600 mt-2">Found: {foundCount}/5</div>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        {gratitudeItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => !item.found && findItem(item.id)}
            className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 ${
              item.found
                ? 'bg-green-100 border-green-300 text-green-800'
                : 'bg-white border-gray-200 hover:border-gray-300 text-gray-800'
            }`}
            whileHover={{ scale: item.found ? 1 : 1.02 }}
            disabled={item.found}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{item.text}</span>
              {item.found && <span className="text-green-600">✓</span>}
            </div>
          </motion.button>
        ))}
      </div>

      {foundCount === 5 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 bg-yellow-100 text-yellow-800 rounded-2xl"
        >
          🌟 Amazing! You found all the gratitude moments!
        </motion.div>
      )}
    </div>
  );
};

const StressBusterGame = () => {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const createBubble = () => {
    const newBubble = {
      id: Date.now(),
      x: Math.random() * 300,
      y: Math.random() * 200,
      size: Math.random() * 30 + 20,
    };
    setBubbles(prev => [...prev, newBubble]);
  };

  const popBubble = (id) => {
    setBubbles(prev => prev.filter(bubble => bubble.id !== id));
    setScore(score + 10);
  };

  const startGame = () => {
    setIsPlaying(true);
    const interval = setInterval(createBubble, 1000);
    return () => clearInterval(interval);
  };

  return (
    <div className="text-center">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Stress Buster</h3>
        <p className="text-gray-600">Pop the stress bubbles to relax!</p>
        <div className="text-2xl font-bold text-gray-600 mt-2">Score: {score}</div>
      </div>

      <div className="relative w-full h-64 bg-gradient-to-b from-blue-100 to-blue-200 rounded-2xl overflow-hidden mb-8">
        {bubbles.map((bubble) => (
          <motion.button
            key={bubble.id}
            onClick={() => popBubble(bubble.id)}
            className="absolute bg-red-200 rounded-full border-2 border-red-300 hover:bg-red-300 transition-colors"
            style={{
              left: bubble.x,
              top: bubble.y,
              width: bubble.size,
              height: bubble.size,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            💥
          </motion.button>
        ))}
      </div>

      {!isPlaying && (
        <motion.button
          onClick={startGame}
          className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Popping Bubbles!
        </motion.button>
      )}
    </div>
  );
};

const MindfulnessMazeGame = () => {
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 2, y: 2 });
  const [moves, setMoves] = useState(0);

  const maze = [
    ['🟢', '⬜', '⬜'],
    ['⬜', '🟫', '⬜'],
    ['⬜', '⬜', '🏁']
  ];

  const movePlayer = (direction) => {
    const newPosition = { ...currentPosition };
    
    switch (direction) {
      case 'up':
        if (newPosition.y > 0) newPosition.y--;
        break;
      case 'down':
        if (newPosition.y < 2) newPosition.y++;
        break;
      case 'left':
        if (newPosition.x > 0) newPosition.x--;
        break;
      case 'right':
        if (newPosition.x < 2) newPosition.x++;
        break;
    }
    
    setCurrentPosition(newPosition);
    setMoves(moves + 1);
  };

  const isComplete = currentPosition.x === targetPosition.x && currentPosition.y === targetPosition.y;

  return (
    <div className="text-center">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Mindfulness Maze</h3>
        <p className="text-gray-600">Navigate to the finish with mindful movements</p>
        <div className="text-lg font-semibold text-gray-600 mt-2">Moves: {moves}</div>
      </div>

      <div className="mb-8">
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {maze.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl ${
                  currentPosition.x === x && currentPosition.y === y
                    ? 'bg-blue-200'
                    : 'bg-gray-100'
                }`}
              >
                {currentPosition.x === x && currentPosition.y === y ? '🧘' : cell}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
        <motion.button
          onClick={() => movePlayer('up')}
          className="p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ↑
        </motion.button>
        <motion.button
          onClick={() => movePlayer('down')}
          className="p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ↓
        </motion.button>
        <motion.button
          onClick={() => movePlayer('left')}
          className="p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ←
        </motion.button>
        <motion.button
          onClick={() => movePlayer('right')}
          className="p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          →
        </motion.button>
      </div>

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 bg-green-100 text-green-800 rounded-2xl"
        >
          🎉 Congratulations! You completed the maze mindfully!
        </motion.div>
      )}
    </div>
  );
};

export default Games;
