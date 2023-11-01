import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import '@mantine/core/styles.css';
import { AuthProvider } from './components/auth/AuthProvider.tsx';
import App from './App.tsx';

import { MantineProvider } from '@mantine/core';
// import { MantineConfig } from './mantine.config.ts';

import { useToggle } from './hooks/useToggle.ts';
const [isDark, toggleDark] = useToggle(false);
const schema: string = isDark ? 'dark' : 'light';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <MantineProvider theme={{ colorScheme: schema }}>
          <App />
        </MantineProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
