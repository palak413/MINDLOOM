import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  MessageCircle, 
  Heart, 
  Shield, 
  AlertTriangle, 
  Users, 
  Clock, 
  MapPin,
  ExternalLink,
  Copy,
  Check,
  X,
  Info,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

const EmergencyServices = () => {
  const [copiedNumber, setCopiedNumber] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const emergencyContacts = [
    {
      id: 'suicide-prevention',
      name: 'National Suicide Prevention Lifeline',
      number: '988',
      description: '24/7 crisis support for suicide prevention',
      type: 'crisis',
      priority: 'high',
      available: '24/7',
      icon: Heart,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'crisis-text',
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: 'Free 24/7 crisis support via text',
      type: 'crisis',
      priority: 'high',
      available: '24/7',
      icon: MessageCircle,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'mental-health',
      name: 'SAMHSA National Helpline',
      number: '1-800-662-4357',
      description: 'Mental health and substance abuse treatment referral',
      type: 'support',
      priority: 'high',
      available: '24/7',
      icon: Shield,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'domestic-violence',
      name: 'National Domestic Violence Hotline',
      number: '1-800-799-7233',
      description: 'Support for domestic violence situations',
      type: 'crisis',
      priority: 'high',
      available: '24/7',
      icon: AlertTriangle,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'lgbtq-crisis',
      name: 'LGBTQ+ Crisis Support',
      number: '1-866-488-7386',
      description: 'Crisis support for LGBTQ+ community',
      type: 'support',
      priority: 'medium',
      available: '24/7',
      icon: Users,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'veterans-crisis',
      name: 'Veterans Crisis Line',
      number: '1-800-273-8255',
      description: 'Crisis support for veterans and their families',
      type: 'crisis',
      priority: 'high',
      available: '24/7',
      icon: Shield,
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  const emergencyResources = [
    {
      title: 'Immediate Safety Planning',
      description: 'Create a safety plan for crisis situations',
      action: 'Create Safety Plan',
      icon: Shield,
      color: 'from-blue-500 to-purple-500'
    },
    {
      title: 'Breathing Exercises',
      description: 'Calm breathing techniques for crisis moments',
      action: 'Start Breathing',
      icon: Heart,
      color: 'from-green-500 to-teal-500'
    },
    {
      title: 'Emergency Contacts',
      description: 'Add trusted emergency contacts',
      action: 'Add Contacts',
      icon: Users,
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Crisis Resources',
      description: 'Local mental health resources and clinics',
      action: 'Find Resources',
      icon: MapPin,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const handleCall = (contact) => {
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      // In a real app, this would initiate a phone call
      toast.success(`Calling ${contact.name}...`);
    }, 2000);
  };

  const handleCopyNumber = (number, id) => {
    navigator.clipboard.writeText(number);
    setCopiedNumber(id);
    toast.success('Number copied to clipboard!');
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const handleText = (contact) => {
    if (contact.id === 'crisis-text') {
      toast.success('Opening text message to Crisis Text Line...');
    } else {
      toast.info('Text support not available for this service');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Enhanced Emergency Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Emergency Orbs */}
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-red-200/20 to-orange-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-200/20 to-yellow-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Floating Emergency Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-red-400/30 to-orange-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.5, 0.5],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}
        
        {/* Emergency Pulse Rings */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 border-2 border-red-300/20 rounded-full"
          animate={{
            scale: [1, 2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 border-2 border-orange-300/20 rounded-full"
          animate={{
            scale: [1, 2, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeOut",
            delay: 1
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Emergency Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-xl">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Emergency Services
              </h1>
              <p className="text-gray-600 text-lg">Immediate help and crisis support</p>
            </div>
          </div>
          
          {/* Emergency Notice */}
          <motion.div 
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-2xl shadow-lg max-w-2xl mx-auto"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-center space-x-2">
              <Info className="w-5 h-5" />
              <span className="font-semibold">If you're in immediate danger, call 911 or your local emergency number</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Crisis Hotlines */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <Phone className="w-6 h-6 text-red-500" />
            <span>Crisis Hotlines</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emergencyContacts.map((contact, index) => {
              const Icon = contact.icon;
              return (
                <motion.div
                  key={contact.id}
                  className="group relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-white/50"
                  initial={{ opacity: 0, y: 20, rotateX: -15 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 100 }}
                  whileHover={{ 
                    y: -8, 
                    scale: 1.03, 
                    rotateY: 2,
                    boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
                  }}
                >
                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${contact.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`} />
                  
                  {/* Animated Border */}
                  <motion.div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${contact.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    style={{
                      background: `linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)`,
                      backgroundSize: '200% 200%',
                    }}
                    animate={{
                      backgroundPosition: ['0% 0%', '200% 200%', '0% 0%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  {/* Priority Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${contact.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      contact.priority === 'high' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {contact.priority === 'high' ? 'URGENT' : 'SUPPORT'}
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-800 mb-2">{contact.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{contact.description}</p>
                  
                  {/* Contact Number */}
                  <div className="bg-gray-50 rounded-xl p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-lg font-bold text-gray-800">{contact.number}</span>
                      <button
                        onClick={() => handleCopyNumber(contact.number, contact.id)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Copy number"
                      >
                        {copiedNumber === contact.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() => handleCall(contact)}
                      className={`group relative flex-1 bg-gradient-to-r ${contact.color} text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 overflow-hidden`}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Button Shine Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                      <Phone className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      <span className="relative z-10">Call</span>
                    </motion.button>
                    
                    {contact.id === 'crisis-text' && (
                      <motion.button
                        onClick={() => handleText(contact)}
                        className="group relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 overflow-hidden"
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {/* Button Shine Effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                        <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span className="relative z-10">Text</span>
                      </motion.button>
                    )}
                  </div>

                  {/* Availability */}
                  <div className="flex items-center space-x-2 mt-3 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{contact.available}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Emergency Resources */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <Shield className="w-6 h-6 text-blue-500" />
            <span>Emergency Resources</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <motion.div
                  key={resource.title}
                  className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${resource.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-2">{resource.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                      <motion.button
                        className={`bg-gradient-to-r ${resource.color} text-white py-2 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {resource.action}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Safety Tips */}
        <motion.div 
          className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <Star className="w-6 h-6 text-yellow-500" />
            <span>Safety Tips</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <p className="text-gray-700">If you're having thoughts of self-harm, reach out to someone you trust immediately.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <p className="text-gray-700">Remove any means of self-harm from your immediate environment.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <p className="text-gray-700">Go to a safe place where you feel comfortable and supported.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">4</span>
                </div>
                <p className="text-gray-700">Practice grounding techniques like deep breathing or focusing on your senses.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">5</span>
                </div>
                <p className="text-gray-700">Remember that these feelings are temporary and help is available.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">6</span>
                </div>
                <p className="text-gray-700">Consider reaching out to a mental health professional for ongoing support.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Call Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md mx-4 shadow-2xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Calling Emergency Service</h3>
                <p className="text-gray-600 mb-6">Connecting you to crisis support...</p>
                <div className="flex space-x-3">
                  <motion.button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-xl font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    className="flex-1 bg-green-500 text-white py-3 px-4 rounded-xl font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Continue
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmergencyServices;
