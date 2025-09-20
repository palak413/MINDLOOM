# Frontend Setup Instructions

## Environment Setup

1. Create a `.env` file in the frontend directory:
```bash
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

## Backend Requirements

Make sure your backend is running on `http://localhost:8000` with the following endpoints:

- Authentication: `/api/v1/auth/*`
- Users: `/api/v1/users/*`
- Journal: `/api/v1/journal/*`
- Tasks: `/api/v1/tasks/*`
- Mood: `/api/v1/mood/*`
- Plant: `/api/v1/plant/*`
- Breathing: `/api/v1/breathing/*`
- Store: `/api/v1/store/*`
- Badges: `/api/v1/badges/*`
- Chat: `/api/v1/chat/*`

## Features Fixed

✅ **Collapsible Sidebar**: Click the menu button to minimize/expand
✅ **Smooth Animations**: Framer Motion animations throughout
✅ **Error Handling**: Graceful API error handling
✅ **Responsive Design**: Works on all screen sizes
✅ **Loading States**: Proper loading indicators
✅ **Toast Notifications**: User feedback for actions

## Troubleshooting

If you encounter issues:

1. Check that the backend is running
2. Verify CORS settings in backend
3. Check browser console for errors
4. Ensure environment variables are set correctly
