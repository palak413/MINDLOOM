import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';
import { apiError } from '../utils/apiError.js';

const router = Router();

// Emergency contacts data
const emergencyContacts = [
  {
    id: 'suicide-prevention',
    name: 'National Suicide Prevention Lifeline',
    number: '988',
    description: '24/7 crisis support for suicide prevention',
    type: 'crisis',
    priority: 'high',
    available: '24/7'
  },
  {
    id: 'crisis-text',
    name: 'Crisis Text Line',
    number: 'Text HOME to 741741',
    description: 'Free 24/7 crisis support via text',
    type: 'crisis',
    priority: 'high',
    available: '24/7'
  },
  {
    id: 'mental-health',
    name: 'SAMHSA National Helpline',
    number: '1-800-662-4357',
    description: 'Mental health and substance abuse treatment referral',
    type: 'support',
    priority: 'high',
    available: '24/7'
  },
  {
    id: 'domestic-violence',
    name: 'National Domestic Violence Hotline',
    number: '1-800-799-7233',
    description: 'Support for domestic violence situations',
    type: 'crisis',
    priority: 'high',
    available: '24/7'
  },
  {
    id: 'lgbtq-crisis',
    name: 'LGBTQ+ Crisis Support',
    number: '1-866-488-7386',
    description: 'Crisis support for LGBTQ+ community',
    type: 'support',
    priority: 'medium',
    available: '24/7'
  },
  {
    id: 'veterans-crisis',
    name: 'Veterans Crisis Line',
    number: '1-800-273-8255',
    description: 'Crisis support for veterans and their families',
    type: 'crisis',
    priority: 'high',
    available: '24/7'
  }
];

// Get all emergency contacts
const getEmergencyContacts = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new apiResponse(200, { contacts: emergencyContacts }, "Emergency contacts retrieved successfully")
  );
});

// Get emergency contacts by type
const getEmergencyContactsByType = asyncHandler(async (req, res) => {
  const { type } = req.params;
  
  if (!type) {
    throw new apiError(400, "Contact type is required");
  }
  
  const filteredContacts = emergencyContacts.filter(contact => contact.type === type);
  
  return res.status(200).json(
    new apiResponse(200, { contacts: filteredContacts }, `${type} emergency contacts retrieved successfully`)
  );
});

// Get high priority emergency contacts
const getHighPriorityContacts = asyncHandler(async (req, res) => {
  const highPriorityContacts = emergencyContacts.filter(contact => contact.priority === 'high');
  
  return res.status(200).json(
    new apiResponse(200, { contacts: highPriorityContacts }, "High priority emergency contacts retrieved successfully")
  );
});

// Emergency detection endpoint
const detectEmergency = asyncHandler(async (req, res) => {
  const { message, voiceData } = req.body;
  
  if (!message && !voiceData) {
    throw new apiError(400, "Message or voice data is required");
  }
  
  const emergencyKeywords = [
    'suicide', 'kill myself', 'end it all', 'not worth living', 'want to die',
    'hurt myself', 'self harm', 'cut myself', 'overdose', 'crisis',
    'emergency', 'help me', 'can\'t take it', 'give up', 'hopeless',
    'desperate', 'crisis', 'urgent', 'immediate help'
  ];
  
  let isEmergency = false;
  let detectedKeywords = [];
  
  if (message) {
    const messageLower = message.toLowerCase();
    detectedKeywords = emergencyKeywords.filter(keyword => messageLower.includes(keyword));
    isEmergency = detectedKeywords.length > 0;
  }
  
  // If voice data is provided, we could analyze it for emotional distress indicators
  // For now, we'll just return the text analysis
  if (voiceData) {
    // TODO: Implement voice emotion analysis for emergency detection
    // This could analyze for signs of distress, panic, or suicidal ideation
  }
  
  const response = {
    isEmergency,
    detectedKeywords,
    confidence: detectedKeywords.length > 0 ? Math.min(detectedKeywords.length * 0.2, 1) : 0,
    recommendations: isEmergency ? [
      'Call 988 (Suicide Prevention Lifeline)',
      'Text HOME to 741741 (Crisis Text Line)',
      'Contact a trusted friend or family member',
      'Go to the nearest emergency room',
      'Call 911 if in immediate danger'
    ] : [],
    emergencyContacts: isEmergency ? emergencyContacts.filter(c => c.priority === 'high') : []
  };
  
  return res.status(200).json(
    new apiResponse(200, response, "Emergency detection completed")
  );
});

// Safety planning endpoint
const createSafetyPlan = asyncHandler(async (req, res) => {
  const { userId, planData } = req.body;
  
  if (!userId) {
    throw new apiError(400, "User ID is required");
  }
  
  // In a real implementation, this would save to the database
  const safetyPlan = {
    id: Date.now(),
    userId,
    createdAt: new Date().toISOString(),
    emergencyContacts: planData.emergencyContacts || [],
    warningSigns: planData.warningSigns || [],
    copingStrategies: planData.copingStrategies || [],
    professionalContacts: planData.professionalContacts || [],
    safePlaces: planData.safePlaces || [],
    reasonsForLiving: planData.reasonsForLiving || []
  };
  
  return res.status(201).json(
    new apiResponse(201, { safetyPlan }, "Safety plan created successfully")
  );
});

// Routes
router.route('/contacts').get(getEmergencyContacts);
router.route('/contacts/type/:type').get(getEmergencyContactsByType);
router.route('/contacts/high-priority').get(getHighPriorityContacts);
router.route('/detect').post(detectEmergency);
router.route('/safety-plan').post(createSafetyPlan);

export default router;
