import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import "./utils/i18n";
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback="loading">
      <App />
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);
