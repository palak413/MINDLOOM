# MindLoom Frontend

A modern React frontend for the MindLoom mental wellness application, built with Vite and Tailwind CSS.

## Features

- **Authentication**: Secure login and registration with JWT tokens
- **Dashboard**: Overview of user progress and quick actions
- **Journaling**: AI-powered mood analysis for journal entries
- **Task Management**: Create and track wellness tasks with categories
- **Plant Care**: Virtual plant that grows with user activities
- **Mood Tracking**: Visual mood logging with stress level tracking
- **Breathing Exercises**: Interactive breathing exercises with animations
- **Store**: Spend points on rewards and decorations
- **Badges**: Achievement system with progress tracking
- **AI Chat**: Mental health support chatbot
- **Profile**: User settings and statistics

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **Socket.IO** - Real-time communication
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your backend URL:
```
VITE_API_URL=http://localhost:8000/api/v1
```

4. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   └── Layout/          # Layout components
├── pages/              # Page components
│   ├── Auth/           # Login/Register pages
│   ├── Dashboard/      # Main dashboard
│   ├── Journal/        # Journaling feature
│   ├── Tasks/          # Task management
│   ├── PlantCare/      # Virtual plant care
│   ├── MoodTracking/   # Mood logging
│   ├── BreathingExercises/ # Breathing exercises
│   ├── Store/          # Points store
│   ├── Badges/         # Achievements
│   ├── Chat/           # AI chat
│   └── Profile/        # User profile
├── services/           # API services
├── stores/            # State management
├── utils/             # Utility functions
└── App.jsx           # Main app component
```

## API Integration

The frontend integrates with the MindLoom backend API:

- **Authentication**: `/api/v1/auth/*`
- **Users**: `/api/v1/users/*`
- **Journal**: `/api/v1/journal/*`
- **Tasks**: `/api/v1/tasks/*`
- **Mood**: `/api/v1/mood/*`
- **Plant**: `/api/v1/plant/*`
- **Breathing**: `/api/v1/breathing/*`
- **Store**: `/api/v1/store/*`
- **Badges**: `/api/v1/badges/*`
- **Chat**: `/api/v1/chat/*`

## Key Features

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interactions

### State Management
- Zustand for global state
- Persistent authentication state
- Optimistic updates

### Real-time Features
- Socket.IO for breathing exercises
- Live notifications
- Real-time plant updates

### Accessibility
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- High contrast support

## Development

### Code Style
- ESLint configuration included
- Prettier formatting
- Component-based architecture
- Custom hooks for logic reuse

### Performance
- Code splitting with React.lazy
- Image optimization
- Bundle size optimization
- Lazy loading

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the MindLoom mental wellness application.
