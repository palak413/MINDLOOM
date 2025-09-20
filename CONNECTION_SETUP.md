# Frontend-Backend Connection Setup Guide

## Environment Setup

### Backend Environment Variables
Create a `.env` file in the `backend` directory with the following content:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/mindloom

# Server Configuration
PORT=8000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# JWT Configuration
JWT_SECRET=ylkjmjhfgnfhfvbdjgffghkmvnbfyhjdgfxgfyfnbfytjrh
JWT_EXPIRY=2sec

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Other API Keys (if needed)
HUGGINGFACE_API_KEY=your-huggingface-api-key-here
```

### Frontend Environment Variables
Create a `.env` file in the `frontend` directory with the following content:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

## Connection Verification

The frontend and backend are now properly connected with the following configurations:

### 1. Axios Configuration
- Base URL: `http://localhost:8000/api/v1`
- Credentials: Enabled for cookie-based authentication
- Proxy: Configured in Vite for development

### 2. Socket.IO Configuration
- Backend: Configured to accept connections from `http://localhost:5173`
- Frontend: Connects to `http://localhost:8000` with credentials

### 3. API Endpoints Verified
All frontend API calls match backend routes:

- **Authentication**: `/auth/login`, `/auth/register`, `/auth/logout`
- **Users**: `/users/me`
- **Tasks**: `/tasks`, `/tasks/:id/complete`
- **Journal**: `/journal`
- **Chat**: `/chat`
- **Store**: `/store`, `/store/:id/buy`
- **Plant**: `/plant/me`, `/plant/water`
- **Breathing**: `/breathing/session`
- **Badges**: `/badges`
- **Admin**: `/admin/users`

## Running the Application

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Important Notes

1. **Database**: Make sure MongoDB is running on `localhost:27017`
2. **CORS**: Backend is configured to accept requests from `http://localhost:5173`
3. **Authentication**: Uses cookie-based authentication with JWT tokens
4. **Socket.IO**: Real-time features require both frontend and backend to be running
5. **Environment Variables**: Update the API keys in the `.env` files with your actual keys

## Troubleshooting

If you encounter connection issues:

1. Check that both servers are running on the correct ports
2. Verify MongoDB is running and accessible
3. Ensure environment variables are properly set
4. Check browser console for CORS errors
5. Verify that the backend `.env` file has the correct `CORS_ORIGIN` value

