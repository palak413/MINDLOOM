import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Target, Music, Zap, Star, Heart } from 'lucide-react';

// Plant Target Game Component
export const PlantTargetGame = ({ onClose, onScore }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [plants, setPlants] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
      setIsPlaying(false);
    }
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setPlants(prev => [...prev, {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20,
          type: Math.random() > 0.3 ? 'good' : 'bad',
          emoji: Math.random() > 0.3 ? '🌱' : '🐛'
        }]);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handlePlantClick = (plant) => {
    if (plant.type === 'good') {
      setScore(score + 10);
      setPlants(prev => prev.filter(p => p.id !== plant.id));
    } else {
      setScore(Math.max(0, score - 5));
      setPlants(prev => prev.filter(p => p.id !== plant.id));
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setPlants([]);
  };

  const resetGame = () => {
    setIsPlaying(false);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setPlants([]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center space-x-2">
            <Target className="w-8 h-8 text-blue-500" />
            <span>Plant Target Game</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="flex justify-center space-x-8 mb-4">
            <div className="bg-blue-100 rounded-2xl px-4 py-2">
              <p className="text-blue-600 font-semibold">Score: {score}</p>
            </div>
            <div className="bg-red-100 rounded-2xl px-4 py-2">
              <p className="text-red-600 font-semibold">Time: {timeLeft}s</p>
            </div>
          </div>

          {!isPlaying && !gameOver && (
            <div className="space-y-4">
              <p className="text-gray-600">Click on 🌱 plants to earn points, avoid 🐛 bugs!</p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
              >
                Start Game
              </button>
            </div>
          )}

          {gameOver && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800">Game Over!</h3>
              <p className="text-xl text-gray-600">Final Score: {score}</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={startGame}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
                >
                  Play Again
                </button>
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-gray-500 text-white rounded-2xl font-semibold hover:bg-gray-600 transition-all duration-200"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Game Area */}
        {isPlaying && (
          <div className="relative bg-gradient-to-b from-green-100 to-blue-100 rounded-2xl h-96 overflow-hidden">
            {plants.map((plant) => (
              <motion.div
                key={plant.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`absolute cursor-pointer text-4xl ${
                  plant.type === 'good' ? 'hover:scale-110' : 'hover:scale-110'
                } transition-transform duration-200`}
                style={{
                  left: `${plant.x}%`,
                  top: `${plant.y}%`,
                }}
                onClick={() => handlePlantClick(plant)}
              >
                {plant.emoji}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

// Music Garden Game Component
export const MusicGardenGame = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [melody, setMelody] = useState([]);
  const [userMelody, setUserMelody] = useState([]);
  const [score, setScore] = useState(0);

  const notes = ['🎵', '🎶', '🎼', '🎹', '🎺', '🎻', '🥁', '🎤'];

  const playNote = (note) => {
    setCurrentNote(note);
    setUserMelody(prev => [...prev, note]);
    setTimeout(() => setCurrentNote(''), 500);
  };

  const generateMelody = () => {
    const newMelody = Array.from({ length: 5 }, () => 
      notes[Math.floor(Math.random() * notes.length)]
    );
    setMelody(newMelody);
    setUserMelody([]);
    setScore(0);
  };

  const checkMelody = () => {
    let correct = 0;
    for (let i = 0; i < Math.min(melody.length, userMelody.length); i++) {
      if (melody[i] === userMelody[i]) correct++;
    }
    setScore(correct);
    return correct === melody.length;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center space-x-2">
            <Music className="w-8 h-8 text-purple-500" />
            <span>Music Garden</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="bg-purple-100 rounded-2xl px-4 py-2 mb-4">
            <p className="text-purple-600 font-semibold">Score: {score}/{melody.length}</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={generateMelody}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              Generate Melody
            </button>

            {melody.length > 0 && (
              <div className="space-y-4">
                <div className="bg-gray-100 rounded-2xl p-4">
                  <p className="text-gray-600 mb-2">Target Melody:</p>
                  <div className="flex justify-center space-x-2">
                    {melody.map((note, index) => (
                      <span key={index} className="text-3xl">{note}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-100 rounded-2xl p-4">
                  <p className="text-blue-600 mb-2">Your Melody:</p>
                  <div className="flex justify-center space-x-2">
                    {userMelody.map((note, index) => (
                      <span key={index} className="text-3xl">{note}</span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={checkMelody}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
                >
                  Check Melody
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Music Notes */}
        <div className="grid grid-cols-4 gap-4">
          {notes.map((note, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => playNote(note)}
              className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl text-4xl hover:from-yellow-200 hover:to-orange-200 transition-all duration-200"
            >
              {note}
            </motion.button>
          ))}
        </div>

        {currentNote && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            <div className="text-8xl">{currentNote}</div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// Plant Puzzle Game Component
export const PlantPuzzleGame = ({ onClose }) => {
  const [puzzle, setPuzzle] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);

  const plantParts = ['🌱', '🌿', '🌳', '🌸', '🌻', '🌹', '🌺', '🌷', '🌼'];

  useEffect(() => {
    generatePuzzle();
  }, []);

  const generatePuzzle = () => {
    const shuffled = [...plantParts].sort(() => Math.random() - 0.5);
    setPuzzle(shuffled);
    setSelectedPiece(null);
    setIsComplete(false);
    setMoves(0);
  };

  const handlePieceClick = (index) => {
    if (isComplete) return;

    if (selectedPiece === null) {
      setSelectedPiece(index);
    } else {
      const newPuzzle = [...puzzle];
      [newPuzzle[selectedPiece], newPuzzle[index]] = [newPuzzle[index], newPuzzle[selectedPiece]];
      setPuzzle(newPuzzle);
      setSelectedPiece(null);
      setMoves(moves + 1);

      // Check if puzzle is complete
      if (JSON.stringify(newPuzzle) === JSON.stringify(plantParts)) {
        setIsComplete(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center space-x-2">
            <Zap className="w-8 h-8 text-green-500" />
            <span>Plant Puzzle</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="bg-green-100 rounded-2xl px-4 py-2 mb-4">
            <p className="text-green-600 font-semibold">Moves: {moves}</p>
          </div>

          {isComplete && (
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 mb-4">
              <h3 className="text-2xl font-bold text-orange-600 mb-2">🎉 Puzzle Complete!</h3>
              <p className="text-orange-600">Great job! You solved it in {moves} moves!</p>
            </div>
          )}

          <p className="text-gray-600 mb-4">
            Arrange the plant parts in the correct order to complete the puzzle!
          </p>

          <button
            onClick={generatePuzzle}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
          >
            New Puzzle
          </button>
        </div>

        {/* Puzzle Grid */}
        <div className="grid grid-cols-3 gap-4">
          {puzzle.map((piece, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePieceClick(index)}
              className={`p-6 rounded-2xl text-4xl transition-all duration-200 ${
                selectedPiece === index
                  ? 'bg-blue-200 border-2 border-blue-400'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {piece}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default { PlantTargetGame, MusicGardenGame, PlantPuzzleGame };
