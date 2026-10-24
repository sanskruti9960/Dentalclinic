import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ClinicProvider } from './context/ClinicContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ClinicProvider>
        <App />
      </ClinicProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
