import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import '@mantine/core/styles.css';
import { AuthProvider } from './components/auth/AuthProvider.tsx';
import App from './App.tsx';

import { MantineProvider } from '@mantine/core';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <MantineProvider>
          <App />
        </MantineProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
