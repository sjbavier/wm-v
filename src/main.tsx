import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import '@mantine/core/styles.css';
import { AuthProvider } from './components/auth/AuthProvider.tsx';
import App from './App.tsx';

import { MantineProvider } from '@mantine/core';
import { ApolloProvider } from '@apollo/client';
import { createApolloClient } from './lib/ApolloClient.ts';
// import { MantineConfig } from './mantine.config.ts';

// import { useToggle } from './hooks/useToggle.ts';
// const [isDark, toggleDark] = useToggle(false);
// const schema: string = isDark ? 'dark' : 'light';
const client = createApolloClient({
  uri: `${import.meta.env.VITE_GO_API}query`
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <ApolloProvider client={client}>
          <MantineProvider
          // theme={{ colorScheme: schema }}
          >
            <App />
          </MantineProvider>
        </ApolloProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
