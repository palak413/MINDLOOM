import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../Icons/IconSystem';
import { chatAPI } from '../../services/api';
import useAuthStore from '../../stores/authStore';

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuthStore();

  // Welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          role: 'assistant',
          content: `Hello ${user?.name || 'there'}! 👋 I'm Aura, your personal wellness assistant. I'm here to help you with your mental health journey, provide encouragement, and offer gentle guidance. How can I support you today?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, user?.name]);

  // Test fallback response
  useEffect(() => {
    if (isOpen) {
      console.log('FloatingChat opened, user:', user);
      console.log('Initial messages:', messages);
    }
  }, [isOpen, user, messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    console.log('Sending message:', currentMessage);
    console.log('Conversation history:', messages);

    try {
      // Prepare conversation history for the API
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      console.log('Calling chatAPI.sendMessage with:', { message: currentMessage, history: conversationHistory });
      const response = await chatAPI.sendMessage(currentMessage, conversationHistory);
      console.log('Chat API response:', response);
      console.log('Response data:', response.data);
      console.log('Response data structure:', JSON.stringify(response.data, null, 2));
      
      // Simulate typing delay for better UX
      setTimeout(() => {
        const responseText = response.data?.data?.response || response.data?.response || 'I apologize, but I had trouble processing your message. Could you please try again?';
        console.log('Extracted response text:', responseText);
        
        const assistantMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: responseText,
          timestamp: new Date()
        };
        
        console.log('Adding assistant message:', assistantMessage);
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        setIsTyping(false);
      }, 1000);

    } catch (error) {
      console.error('Chat error:', error);
      console.error('Error details:', error.response?.data);
      
      // Provide helpful fallback responses based on keywords
      const fallbackResponse = getFallbackResponse(currentMessage);
      console.log('Using fallback response:', fallbackResponse);
      
      setTimeout(() => {
        const assistantMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: fallbackResponse,
          timestamp: new Date()
        };
        
        console.log('Adding fallback message:', assistantMessage);
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        setIsTyping(false);
      }, 1000);
    }
  };

  const getFallbackResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
      return "I understand you're feeling anxious. That's completely normal. Try taking a few deep breaths and remember that this feeling will pass. Would you like to try a breathing exercise?";
    }
    
    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) {
      return "I'm sorry you're feeling down. It's okay to have these feelings. Remember that you're not alone, and it's important to be kind to yourself. Have you tried journaling about how you're feeling?";
    }
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('stressed')) {
      return "Stress can be overwhelming. Let's break it down together. What's one small thing you can do right now to help yourself feel better? Sometimes taking a short walk or doing something you enjoy can help.";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "I'm here to support you! I can help with mood tracking, provide encouragement, suggest activities, or just listen. What would be most helpful for you right now?";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `Hello ${user?.name || 'there'}! 👋 I'm Aura, your personal wellness assistant. How are you feeling today?`;
    }
    
    return "I'm here to listen and support you. Sometimes just talking about what's on your mind can help. What's been on your mind lately?";
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2 }}
      >
        <Icon name="chat" size="lg" className="text-white" />
        
        {/* Notification Badge */}
        {!isOpen && (
          <motion.div
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Icon name="sparkles" size="xs" />
          </motion.div>
        )}
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Chat with Aura
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon name="brain" size="sm" className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Aura Assistant</h3>
                  <p className="text-xs text-emerald-100">Your wellness companion</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const testMessage = {
                      id: Date.now(),
                      role: 'assistant',
                      content: 'Test message - fallback responses are working! 🎉',
                      timestamp: new Date()
                    };
                    setMessages(prev => [...prev, testMessage]);
                  }}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  title="Test fallback"
                >
                  <Icon name="sparkles" size="sm" className="text-white" />
                </button>
                <button
                  onClick={clearChat}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  title="Clear chat"
                >
                  <Icon name="delete" size="sm" className="text-white" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <Icon name="times" size="sm" className="text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-emerald-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-white text-gray-800 border border-gray-200 p-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 resize-none border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-2 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
                >
                  <Icon name="send" size="sm" className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChat;
