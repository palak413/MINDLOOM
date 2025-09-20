import React, { useState, useEffect, useRef } from 'react';
import { 
  Wind, 
  Play, 
  Pause, 
  RotateCcw, 
  Timer,
  Target,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { breathingAPI } from '../../services/api';
import toast from 'react-hot-toast';

const BreathingExercises = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale, rest
  const [timeLeft, setTimeLeft] = useState(4);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [score, setScore] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const intervalRef = useRef(null);
  const sessionStartTime = useRef(null);

  const breathingPattern = {
    inhale: { duration: 4, instruction: 'Breathe In' },
    hold: { duration: 4, instruction: 'Hold' },
    exhale: { duration: 6, instruction: 'Breathe Out' },
    rest: { duration: 2, instruction: 'Rest' }
  };

  const phases = ['inhale', 'hold', 'exhale', 'rest'];

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      // This would typically fetch from API
      setSessions([]);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            const currentPhaseIndex = phases.indexOf(phase);
            const nextPhaseIndex = (currentPhaseIndex + 1) % phases.length;
            const nextPhase = phases[nextPhaseIndex];
            setPhase(nextPhase);
            return breathingPattern[nextPhase].duration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused, phase]);

  useEffect(() => {
    if (isActive && !isPaused) {
      const interval = setInterval(() => {
        setSessionDuration((prev) => prev + 1);
        setScore((prev) => prev + 1); // Simple scoring based on time
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isActive, isPaused]);

  const startSession = () => {
    setIsActive(true);
    setIsPaused(false);
    sessionStartTime.current = Date.now();
    setSessionDuration(0);
    setScore(0);
    setPhase('inhale');
    setTimeLeft(breathingPattern.inhale.duration);
  };

  const pauseSession = () => {
    setIsPaused(!isPaused);
  };

  const stopSession = async () => {
    setIsActive(false);
    setIsPaused(false);
    setPhase('inhale');
    setTimeLeft(4);
    
    if (sessionStartTime.current) {
      const duration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      try {
        await breathingAPI.logSession({
          durationInSeconds: duration,
          score: score,
          pointsAwarded: Math.floor(score / 10)
        });
        toast.success(`Session completed! +${Math.floor(score / 10)} points`);
      } catch (error) {
        console.error('Error saving session:', error);
        toast.error('Failed to save session');
      }
    }
    
    setSessionDuration(0);
    setScore(0);
  };

  const resetSession = () => {
    setIsActive(false);
    setIsPaused(false);
    setPhase('inhale');
    setTimeLeft(4);
    setSessionDuration(0);
    setScore(0);
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'text-blue-600';
      case 'hold': return 'text-purple-600';
      case 'exhale': return 'text-green-600';
      case 'rest': return 'text-gray-600';
      default: return 'text-blue-600';
    }
  };

  const getPhaseBgColor = () => {
    switch (phase) {
      case 'inhale': return 'bg-blue-100';
      case 'hold': return 'bg-purple-100';
      case 'exhale': return 'bg-green-100';
      case 'rest': return 'bg-gray-100';
      default: return 'bg-blue-100';
    }
  };

  const getCircleSize = () => {
    switch (phase) {
      case 'inhale': return 'scale-110';
      case 'hold': return 'scale-110';
      case 'exhale': return 'scale-75';
      case 'rest': return 'scale-100';
      default: return 'scale-100';
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Wind className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Breathing Exercises</h1>
            <p className="text-gray-600">Find your calm through mindful breathing</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>{sessions.length} sessions</span>
        </div>
      </div>

      {/* Breathing Exercise */}
      <div className="card">
        <div className="text-center">
          {/* Breathing Circle */}
          <div className="mb-8">
            <div className="relative w-64 h-64 mx-auto">
              <div 
                className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 transition-transform duration-1000 ease-in-out ${getCircleSize()}`}
                style={{
                  animation: isActive && !isPaused ? 'pulse 2s infinite' : 'none'
                }}
              >
                <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-6xl font-bold ${getPhaseColor()} mb-2`}>
                      {timeLeft}
                    </div>
                    <div className={`text-lg font-medium ${getPhaseColor()}`}>
                      {breathingPattern[phase].instruction}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Session Stats */}
          {isActive && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-3">
                <Timer className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold text-gray-800">{formatTime(sessionDuration)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <Target className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Score</p>
                <p className="font-semibold text-gray-800">{score}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <Sparkles className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Points</p>
                <p className="font-semibold text-gray-800">{Math.floor(score / 10)}</p>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            {!isActive ? (
              <button
                onClick={startSession}
                className="btn-primary flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Start Session</span>
              </button>
            ) : (
              <>
                <button
                  onClick={pauseSession}
                  className="btn-secondary flex items-center space-x-2"
                >
                  {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>
                <button
                  onClick={stopSession}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>End Session</span>
                </button>
              </>
            )}
          </div>

          {isActive && (
            <button
              onClick={resetSession}
              className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
            >
              Reset Session
            </button>
          )}
        </div>
      </div>

      {/* Breathing Guide */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Breathing Pattern</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {phases.map((phaseName) => (
            <div 
              key={phaseName}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                phase === phaseName 
                  ? `${getPhaseBgColor()} border-current` 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="text-center">
                <div className={`text-2xl font-bold mb-2 ${phase === phaseName ? getPhaseColor() : 'text-gray-600'}`}>
                  {breathingPattern[phaseName].duration}s
                </div>
                <div className={`text-sm font-medium capitalize ${phase === phaseName ? getPhaseColor() : 'text-gray-600'}`}>
                  {breathingPattern[phaseName].instruction}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Benefits of Breathing Exercises</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-sm">1</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Reduces Stress</p>
              <p className="text-sm text-gray-600">Activates the parasympathetic nervous system</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 text-sm">2</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Improves Focus</p>
              <p className="text-sm text-gray-600">Enhances concentration and mental clarity</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-purple-600 text-sm">3</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Better Sleep</p>
              <p className="text-sm text-gray-600">Promotes relaxation and restful sleep</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-pink-600 text-sm">4</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Emotional Balance</p>
              <p className="text-sm text-gray-600">Helps regulate emotions and mood</p>
            </div>
          </div>
        </div>
      </div>

      {/* Session History */}
      {sessions.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Sessions</h3>
          <div className="space-y-3">
            {sessions.slice(0, 5).map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Wind className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {formatTime(session.durationInSeconds)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{session.score} pts</p>
                  <p className="text-sm text-gray-500">+{session.pointsAwarded} points</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BreathingExercises;
