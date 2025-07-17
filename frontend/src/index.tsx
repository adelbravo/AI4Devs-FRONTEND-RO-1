import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Suppress specific React warnings
const originalConsoleWarn = console.warn;
console.warn = function filterWarnings(msg, ...args) {
  // Filter out specific warnings
  if (typeof msg === 'string' && msg.includes('defaultProps will be removed from memo components')) {
    return;
  }
  originalConsoleWarn(msg, ...args);
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// Removing StrictMode to avoid issues with react-beautiful-dnd
root.render(
  <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
