# 🚀 MINDLOOM Deployment Guide

This guide will help you deploy MINDLOOM to production using Vercel for the frontend and Railway/Render for the backend.

## 📋 Prerequisites

- GitHub account
- Vercel account
- Railway or Render account
- MongoDB Atlas account
- API Keys (OpenAI, Google Gemini, AssemblyAI)

## 🎯 Deployment Strategy

- **Frontend**: Vercel (Free, Fast, Easy)
- **Backend**: Railway/Render (Free tier available)
- **Database**: MongoDB Atlas (Free tier)

## 🌐 Frontend Deployment (Vercel)

### Step 1: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your `YashChaudhary841/MINDLOOM` repository

### Step 2: Configure Build Settings
```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Step 3: Environment Variables
Add these environment variables in Vercel:
```
VITE_API_URL=https://your-backend-url.railway.app/api/v1
```

### Step 4: Deploy
- Click "Deploy"
- Wait for deployment to complete
- Your frontend will be available at `https://your-project.vercel.app`

## ⚙️ Backend Deployment (Railway)

### Step 1: Connect to Railway
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your MINDLOOM repository

### Step 2: Configure Service
1. Set **Root Directory** to `backend`
2. Railway will auto-detect Node.js

### Step 3: Environment Variables
Add these environment variables in Railway:
```
PORT=8000
CORS_ORIGIN=https://your-frontend-url.vercel.app
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mindloom
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
ASSEMBLYAI_API_KEY=your_assemblyai_key
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
BCRYPT_SALT_ROUNDS=10
```

### Step 4: Deploy
- Railway will automatically deploy
- Your backend will be available at `https://your-project.railway.app`

## 🔄 Alternative: Backend Deployment (Render)

### Step 1: Connect to Render
1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository

### Step 2: Configure Service
```
Name: mindloom-backend
Environment: Node
Build Command: npm install
Start Command: npm start
Root Directory: backend
```

### Step 3: Environment Variables
Same as Railway configuration above.

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create Cluster
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free cluster
3. Choose your region

### Step 2: Database Access
1. Go to "Database Access"
2. Create a new database user
3. Set username and password
4. Grant "Read and write to any database"

### Step 3: Network Access
1. Go to "Network Access"
2. Add IP Address: `0.0.0.0/0` (Allow access from anywhere)
3. Or add your specific IP addresses

### Step 4: Get Connection String
1. Go to "Clusters"
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password

## 🔧 Post-Deployment Configuration

### Step 1: Update Frontend Environment
Update your Vercel environment variables with the actual backend URL:
```
VITE_API_URL=https://your-actual-backend-url.railway.app/api/v1
```

### Step 2: Test the Application
1. Visit your frontend URL
2. Try registering a new user
3. Test the login functionality
4. Verify all features work correctly

### Step 3: Domain Configuration (Optional)
- **Custom Domain**: Add your custom domain in Vercel settings
- **SSL**: Automatically handled by Vercel and Railway/Render

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CORS_ORIGIN` in backend matches your frontend URL
   - Check for trailing slashes in URLs

2. **Database Connection Issues**
   - Verify MongoDB Atlas cluster is running
   - Check network access settings
   - Verify connection string format

3. **API Key Issues**
   - Ensure all API keys are correctly set
   - Check for typos in environment variable names
   - Verify API key permissions

4. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

### Debug Commands

```bash
# Check backend logs
railway logs

# Check frontend build logs
vercel logs

# Test API endpoints
curl https://your-backend-url.railway.app/api/v1/auth/login
```

## 📊 Monitoring

### Vercel Analytics
- Enable Vercel Analytics for frontend monitoring
- Track page views and performance

### Railway/Render Monitoring
- Monitor backend performance
- Set up alerts for downtime
- Track API usage and errors

## 🔄 Updates and Maintenance

### Frontend Updates
1. Push changes to GitHub
2. Vercel automatically redeploys
3. No manual intervention needed

### Backend Updates
1. Push changes to GitHub
2. Railway/Render automatically redeploys
3. Monitor deployment logs

### Database Maintenance
- Regular backups through MongoDB Atlas
- Monitor database performance
- Scale as needed

## 💰 Cost Estimation

### Free Tier Limits
- **Vercel**: 100GB bandwidth/month, unlimited deployments
- **Railway**: $5 credit/month (usually enough for small apps)
- **Render**: 750 hours/month free
- **MongoDB Atlas**: 512MB storage free

### Scaling Considerations
- Monitor usage and upgrade plans as needed
- Consider CDN for static assets
- Implement caching strategies

## 🎉 Success!

Your MINDLOOM application is now live and accessible to users worldwide!

**Frontend**: `https://your-project.vercel.app`
**Backend**: `https://your-project.railway.app`

Remember to:
- Monitor performance regularly
- Keep dependencies updated
- Backup your database
- Monitor API usage and costs

---

**Happy Deploying! 🚀**
