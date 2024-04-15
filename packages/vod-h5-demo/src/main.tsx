import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import flexible from './utils/flexible';

import './index.less';

flexible(window, document);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
