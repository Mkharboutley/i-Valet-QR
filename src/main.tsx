
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeFirebase } from './services/firebase';
import App from './App.tsx';
import './index.css';

// Initialize Firebase before rendering the app
try {
  initializeFirebase();
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
}

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
