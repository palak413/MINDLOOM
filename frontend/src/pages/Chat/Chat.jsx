import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Heart,
  Lightbulb,
  Shield,
  Clock
} from 'lucide-react';
import { chatAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your AI wellness companion. I'm here to help you with your mental health journey. How are you feeling today?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'welcome'
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Prepare conversation history for the backend
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const response = await chatAPI.sendMessage(currentMessage, conversationHistory);
      
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.data.response,
        sender: 'bot',
        timestamp: new Date()
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, 1000 + Math.random() * 1000); // Simulate typing delay

    } catch (error) {
      console.error('Chat error:', error);
      
      // Provide helpful fallback responses based on the message
      const fallbackResponses = {
        'anxious': "I understand you're feeling anxious. Try taking some deep breaths and remember that this feeling will pass. You're stronger than you think!",
        'stress': "Stress is a natural part of life. Consider trying some breathing exercises or taking a short walk. You've got this!",
        'motivation': "Sometimes motivation comes from action, not the other way around. Start with one small step - you'll be surprised how it builds momentum!",
        'sleep': "Good sleep is so important for your wellbeing. Try creating a relaxing bedtime routine and avoid screens an hour before bed.",
        'overwhelmed': "When you feel overwhelmed, break things down into smaller, manageable tasks. You don't have to do everything at once."
      };
      
      let fallbackResponse = "I'm here to listen and support you. How are you feeling today?";
      
      // Check if the message contains keywords for specific responses
      const messageLower = currentMessage.toLowerCase();
      for (const [keyword, response] of Object.entries(fallbackResponses)) {
        if (messageLower.includes(keyword)) {
          fallbackResponse = response;
          break;
        }
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        text: fallbackResponse,
        sender: 'bot',
        timestamp: new Date(),
        type: 'fallback'
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, 1500);
    }
  };

  const quickPrompts = [
    "I'm feeling anxious today",
    "Help me with stress management",
    "I need motivation",
    "How can I sleep better?",
    "I'm feeling overwhelmed"
  ];

  const handleQuickPrompt = (prompt) => {
    setInputMessage(prompt);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">AI Chat</h1>
            <p className="text-gray-600">Your personal wellness companion</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Sparkles className="w-4 h-4" />
          <span>AI Powered</span>
        </div>
      </div>

      {/* Chat Container */}
      <div className="card p-0 overflow-hidden">
        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.type === 'error'
                    ? 'bg-red-100 text-red-800'
                    : message.type === 'welcome'
                    ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length === 1 && (
          <div className="border-t border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-3">Quick prompts to get started:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors duration-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* AI Features */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Wellness Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Heart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-800 mb-1">Emotional Support</h4>
            <p className="text-sm text-gray-600">Get compassionate responses to your feelings</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Lightbulb className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-800 mb-1">Wellness Tips</h4>
            <p className="text-sm text-gray-600">Receive personalized wellness advice</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-800 mb-1">Safe Space</h4>
            <p className="text-sm text-gray-600">Share your thoughts without judgment</p>
          </div>
          
          <div className="text-center p-4 bg-pink-50 rounded-lg">
            <Clock className="w-8 h-8 text-pink-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-800 mb-1">24/7 Available</h4>
            <p className="text-sm text-gray-600">Chat anytime you need support</p>
          </div>
        </div>
      </div>

      {/* Guidelines */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Chat Guidelines</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-sm">1</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Be Open and Honest</p>
              <p className="text-sm text-gray-600">Share your feelings openly for better support</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 text-sm">2</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Ask Specific Questions</p>
              <p className="text-sm text-gray-600">The more specific you are, the better I can help</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-yellow-600 text-sm">3</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Remember: I'm Not a Replacement</p>
              <p className="text-sm text-gray-600">For professional help, please consult a mental health professional</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
