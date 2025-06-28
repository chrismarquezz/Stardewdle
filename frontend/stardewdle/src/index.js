import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Amplify from 'aws-amplify';
import awsExports from './aws-exports';
Amplify.configure(awsExports);

import { SoundProvider } from "./context/SoundContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SoundProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </SoundProvider>
);

reportWebVitals();
