import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './assets/index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.jsx';
import { SocketProvider } from './context/SocketProvider.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // <-- IMPORT

const queryClient = new QueryClient(); // <-- CREATE CLIENT

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <QueryClientProvider client={queryClient}> {/* <-- WRAP APP */}
            <App />
          </QueryClientProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);