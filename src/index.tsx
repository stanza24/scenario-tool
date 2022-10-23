import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from 'App';
import 'services/consoleAPI';

import 'antd/dist/antd.css';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App />);

// @ts-ignore
window['__react-beautiful-dnd-disable-dev-warnings'] = true;
console.error = (...props) =>
  props.every(
    (error) => !error.includes('http://localhost:3000/static/js/bundle.js')
  ) && console.warn(...props);
