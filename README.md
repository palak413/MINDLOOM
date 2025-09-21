# 🌸 MINDLOOM - Mental Wellness Companion

A comprehensive AI-powered mental wellness application that combines mood tracking, journaling, breathing exercises, plant care, and intelligent assistance to support your mental health journey.

![MINDLOOM Dashboard](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-18.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

## ✨ Features

### 🧠 **Intelligent Dashboard**
- **AI-Powered Mood Detection**: Passive voice analysis that continuously monitors emotional state
- **Personalized Interventions**: Proactive suggestions when you're feeling low
- **Real-time Analytics**: Visual mood patterns and wellness insights
- **Emergency Detection**: Crisis situation recognition with immediate support

### 📝 **Digital Journaling**
- **Smart Writing**: AI-assisted journaling with mood correlation
- **Streak Tracking**: Gamified writing streaks to build healthy habits
- **Word Count Analytics**: Track your thoughts and progress over time

### 🌱 **Virtual Plant Care**
- **Growth Through Wellness**: Plant grows as you complete wellness activities
- **Interactive Games**: Mini-games for stress relief and engagement
- **Music Garden**: Soothing music player integrated with plant care

### 🧘 **Breathing & Meditation**
- **Guided Sessions**: Structured breathing exercises with real-time feedback
- **Meditation Library**: Curated audio and video content for relaxation
- **Progress Tracking**: Session history and improvement metrics

### 🤖 **AI Assistant**
- **24/7 Support**: Intelligent chat companion for mental wellness
- **Crisis Intervention**: Emergency detection with immediate resource connection
- **Personalized Advice**: Context-aware suggestions based on your mood patterns

### 🏆 **Gamification**
- **Badge System**: Achievements for wellness milestones
- **Point System**: Earn points through healthy activities
- **Streak Tracking**: Build consistent wellness habits

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- API Keys (OpenAI, Google Gemini, AssemblyAI)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YashChaudhary841/MINDLOOM.git
   cd MINDLOOM
   ```

2. **Download ML Models** ⚠️ **REQUIRED**
   ```bash
   # Automated download (recommended)
   npm run download-models
   
   # Or verify existing models
   npm run verify-models
   ```
   
   **Manual Download**: If automated download fails, follow [ML Models Setup Guide](ML_MODELS_SETUP.md)

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Add your environment variables
   npm start
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

### 🤖 ML Models Setup

**Important**: MINDLOOM requires ML models for full AI functionality. These models are too large for GitHub and must be downloaded separately.

#### Quick Setup
```bash
# Download models automatically
npm run download-models

# Verify installation
npm run verify-models
```

#### Manual Setup
1. **Download from Google Drive**: [ML Models Folder](https://drive.google.com/drive/folders/1AbYxAAFPcSYvXUMvx2WJv7NsH83Q6gop)
2. **Extract to project root**: Models will be placed in correct directories
3. **Verify**: Run `npm run verify-models`

#### Required Models
- **CBT Therapy Model** (~255MB) - Cognitive Behavioral Therapy analysis
- **Voice Emotion Models** (~50MB) - Real-time emotion detection
- **Enhanced Voice Analysis** (~15MB) - Advanced voice processing
- **Simple Voice Models** (~8MB) - Basic voice analysis

**Without these models**, the app runs in demo mode with limited AI features.

See [ML_MODELS_SETUP.md](ML_MODELS_SETUP.md) for detailed instructions.

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Zustand** - State management
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Socket.IO** - Real-time communication
- **Cron Jobs** - Scheduled tasks

### AI Integration
- **OpenAI GPT** - Conversational AI
- **Google Gemini** - Advanced AI capabilities
- **AssemblyAI** - Voice analysis and emotion detection

## 📱 Deployment

### Vercel (Frontend)
1. Connect GitHub repository to Vercel
2. Set build directory to `frontend`
3. Add environment variables:
   - `VITE_API_URL`: Your backend URL

### Railway/Render (Backend)
1. Connect GitHub repository
2. Set root directory to `backend`
3. Add environment variables:
   - `MONGODB_URI`
   - `OPENAI_API_KEY`
   - `GEMINI_API_KEY`
   - `JWT_SECRET`

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=8000
CORS_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/mindloom
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
ASSEMBLYAI_API_KEY=your_assemblyai_key
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
EMAIL_USER=your_email
EMAIL_PASS=your_password
BCRYPT_SALT_ROUNDS=10
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:8000/api/v1
```

## 📁 Project Structure

```
MINDLOOM/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middlewares/     # Custom middlewares
│   │   ├── jobs/            # Cron jobs
│   │   └── sockets/          # Socket.IO handlers
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── stores/          # State management
│   │   └── utils/           # Utility functions
│   └── package.json
├── ml_cbt_service/          # Python ML service
└── vercel.json             # Vercel configuration
```

## 🎯 Key Features Explained

### Intelligent Mood Detection
- **Passive Monitoring**: Continuous voice analysis without user input
- **Behavioral Patterns**: Tracks user interactions and web activity
- **Proactive Support**: Automatically suggests interventions when needed

### Emergency Services Integration
- **Crisis Detection**: AI identifies emergency keywords and situations
- **Immediate Support**: Direct connection to crisis hotlines
- **Resource Access**: Quick access to emergency contacts and resources

### Plant Care Gamification
- **Growth System**: Plant grows through wellness activities
- **Interactive Elements**: Mini-games and music integration
- **Progress Visualization**: Visual representation of wellness journey

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Email**: support@mindloom.app
- **GitHub Issues**: [Create an issue](https://github.com/YashChaudhary841/MINDLOOM/issues)
- **Documentation**: [Wiki](https://github.com/YashChaudhary841/MINDLOOM/wiki)

## 🙏 Acknowledgments

- OpenAI for GPT integration
- Google for Gemini AI capabilities
- AssemblyAI for voice analysis
- The mental health community for inspiration

---

**Built with ❤️ for mental wellness**

*MINDLOOM - Where technology meets empathy*