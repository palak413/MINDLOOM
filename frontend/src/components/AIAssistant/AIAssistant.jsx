import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Send, 
  Bot, 
  Brain, 
  Heart, 
  Sparkles,
  Volume2,
  VolumeX,
  Settings,
  Minimize2,
  Maximize2,
  Move,
  GripVertical,
  AlertTriangle,
  Phone,
  MessageCircle
} from 'lucide-react';
import aiAssistantService from '../../services/aiAssistantService';
import EmergencyAPI from '../../services/emergencyService';
import { toast } from 'react-hot-toast';

const AIAssistant = ({ isOpen, onClose, onMinimize }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentMood, setCurrentMood] = useState('neutral');
  const [moodConfidence, setMoodConfidence] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [showMoodDetails, setShowMoodDetails] = useState(false);
  const [assistantPersonality, setAssistantPersonality] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [emergencyDetected, setEmergencyDetected] = useState(false);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const dragControls = useDragControls();

  // Initialize assistant
  useEffect(() => {
    if (isOpen) {
      initializeAssistant();
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeAssistant = () => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'assistant',
      content: `Hello! I'm your personal AI assistant. I can analyze your voice emotions and have intelligent conversations with you. How are you feeling today?`,
      timestamp: new Date().toISOString(),
      mood: 'neutral'
    };
    setMessages([welcomeMessage]);
    setCurrentMood('neutral');
    setMoodConfidence(0);
  };

  // Drag event handlers
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    setDragPosition({ x: info.point.x, y: info.point.y });
  };

  const handleDrag = (event, info) => {
    // Optional: Add any drag feedback here
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    // Emergency detection
    const emergencyCheck = EmergencyAPI.checkForEmergency(inputMessage);
    
    if (emergencyCheck.isEmergency) {
      setEmergencyDetected(true);
      setShowEmergencyAlert(true);
      toast.error('Emergency detected! Please seek immediate help.');
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
      isEmergency: emergencyCheck.isEmergency
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);

    try {
      const response = await aiAssistantService.sendMessage(inputMessage);
      
      if (response.success) {
        const assistantMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: emergencyCheck.isEmergency 
            ? "I'm very concerned about what you're going through. Please know that you're not alone and help is available right now. I strongly encourage you to reach out to a crisis helpline immediately. Your life has value, and there are people who want to help you through this difficult time."
            : response.message,
          timestamp: response.timestamp,
          mood: currentMood,
          suggestions: emergencyCheck.isEmergency 
            ? EmergencyAPI.getEmergencySuggestions()
            : response.suggestions || [],
          isEmergency: emergencyCheck.isEmergency
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        if (response.moodInsights) {
          setCurrentMood(response.moodInsights.emotion);
          setMoodConfidence(response.moodInsights.confidence);
        }
      } else {
        throw new Error(response.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Sorry, I had trouble processing that. Please try again.');
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
        mood: currentMood
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceRecording = async () => {
    if (isRecording) {
      // Stop recording
      const result = aiAssistantService.stopVoiceRecording();
      if (result.success) {
        setIsRecording(false);
        setIsProcessing(true);
        toast.success('Processing your voice...');
      } else {
        toast.error(result.error);
      }
    } else {
      // Start recording
      const result = await aiAssistantService.startVoiceRecording();
      if (result.success) {
        setIsRecording(true);
        setIsListening(true);
        toast.success('Listening... Speak now!');
      } else {
        toast.error(result.error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMoodColor = (mood) => {
    const colors = {
      happy: 'from-yellow-400 to-orange-500',
      sad: 'from-blue-400 to-indigo-500',
      angry: 'from-red-400 to-pink-500',
      fear: 'from-purple-400 to-violet-500',
      surprise: 'from-green-400 to-emerald-500',
      disgust: 'from-gray-400 to-slate-500',
      neutral: 'from-blue-500 to-purple-600'
    };
    return colors[mood] || colors.neutral;
  };

  const getMoodEmoji = (mood) => {
    const emojis = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      fear: '😨',
      surprise: '😲',
      disgust: '🤢',
      neutral: '😐'
    };
    return emojis[mood] || emojis.neutral;
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            drag
            dragControls={dragControls}
            dragMomentum={false}
            dragElastic={0.1}
            dragConstraints={{
              left: -300,
              right: 300,
              top: -200,
              bottom: 200
            }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrag={handleDrag}
            whileDrag={{ 
              scale: 1.05, 
              rotate: 2,
              boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
              zIndex: 1000
            }}
            className={`fixed bottom-4 right-4 z-50 ${
              isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
            } bg-white/95 backdrop-blur-xl rounded-3xl shadow-3xl border border-white/30 hover:border-white/50 overflow-hidden transition-all duration-500 ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {/* Drag Indicator Overlay */}
            {isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-3xl pointer-events-none z-10"
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center"
                  >
                    <Move className="w-8 h-8 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Header */}
            <div className={`bg-gradient-to-r ${getMoodColor(currentMood)} p-4 text-white relative backdrop-blur-sm`}>
              {/* Enhanced Drag Handle */}
              <div
                className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-white/20 rounded-full cursor-grab hover:bg-white/40 transition-all duration-200 flex items-center justify-center group"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-white/60 rounded-full group-hover:bg-white/80 transition-colors"></div>
                  <div className="w-1 h-1 bg-white/60 rounded-full group-hover:bg-white/80 transition-colors"></div>
                  <div className="w-1 h-1 bg-white/60 rounded-full group-hover:bg-white/80 transition-colors"></div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Bot className="w-8 h-8" />
                    {isListening && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <Volume2 className="w-2 h-2 text-white" />
                      </motion.div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Aura AI</h3>
                    <p className="text-sm opacity-90">
                      {getMoodEmoji(currentMood)} {currentMood.charAt(0).toUpperCase() + currentMood.slice(1)}
                      {moodConfidence > 0 && ` (${Math.round(moodConfidence * 100)}%)`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowMoodDetails(!showMoodDetails)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="Mood Details"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title={isMinimized ? "Maximize" : "Minimize"}
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl ${
                            message.type === 'user'
                              ? 'bg-blue-500 text-white'
                              : message.isEmergency
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                          
                          {/* Emergency indicator */}
                          {message.isEmergency && (
                            <div className="flex items-center space-x-1 mt-2">
                              <AlertTriangle className="w-3 h-3 text-red-600" />
                              <span className="text-xs text-red-600 font-semibold">Emergency Detected</span>
                            </div>
                          )}
                          
                          {/* Suggestions */}
                          {message.suggestions && message.suggestions.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.suggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => setInputMessage(suggestion)}
                                  className="block w-full text-left text-xs bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-colors"
                                >
                                  💡 {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-100 p-3 rounded-2xl">
                        <div className="flex items-center space-x-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
                          />
                          <span className="text-sm text-gray-600">Thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message or use voice..."
                      className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isProcessing}
                    />
                    
                    <button
                      onClick={handleVoiceRecording}
                      disabled={isProcessing}
                      className={`p-3 rounded-xl transition-colors ${
                        isRecording
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={isRecording ? "Stop Recording" : "Start Voice Recording"}
                    >
                      {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isProcessing}
                      className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Send Message"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Voice Status */}
                  {isRecording && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-2 text-sm text-gray-600"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <Volume2 className="w-4 h-4" />
                      </motion.div>
                      <span>Listening... Speak now!</span>
                    </motion.div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency Alert Modal */}
      <AnimatePresence>
        {showEmergencyAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-red-500/20 backdrop-blur-sm flex items-center justify-center z-[100]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md mx-4 shadow-2xl border-2 border-red-500"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-red-600 mb-4">Emergency Detected</h3>
                <p className="text-gray-700 mb-6">
                  I'm very concerned about your safety. Please reach out for immediate help. 
                  You're not alone, and there are people who want to help you.
                </p>
                
                <div className="space-y-3 mb-6">
                  <motion.button
                    onClick={() => window.open('tel:988', '_self')}
                    className="w-full bg-red-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call 988 (Suicide Prevention)</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => window.open('sms:741741&body=HOME', '_self')}
                    className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Text HOME to 741741</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => window.location.href = '/emergency'}
                    className="w-full bg-orange-500 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <AlertTriangle className="w-5 h-5" />
                    <span>Emergency Services</span>
                  </motion.button>
                </div>
                
                <div className="flex space-x-3">
                  <motion.button
                    onClick={() => setShowEmergencyAlert(false)}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-xl font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Dismiss
                  </motion.button>
                  <motion.button
                    onClick={() => window.open('tel:911', '_self')}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-xl font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Call 911
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;