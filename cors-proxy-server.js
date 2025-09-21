// CORS Proxy Server
// This server acts as a proxy to bypass CORS restrictions

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Proxy for audio files
app.use('/audio', createProxyMiddleware({
  target: 'https://your-audio-domain.com',
  changeOrigin: true,
  pathRewrite: {
    '^/audio': '', // Remove /audio prefix
  },
  onProxyReq: (proxyReq, req, res) => {
    // Add CORS headers
    proxyReq.setHeader('Access-Control-Allow-Origin', '*');
    proxyReq.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    proxyReq.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  },
  onProxyRes: (proxyRes, req, res) => {
    // Add CORS headers to response
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'CORS Proxy Server Running', port: PORT });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CORS Proxy Server running on http://localhost:${PORT}`);
  console.log(`📁 Audio proxy: http://localhost:${PORT}/audio`);
  console.log(`🔧 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
