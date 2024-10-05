import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // Importa Provider de react-redux
import store from './store'; // Importa tu store
import App from './App';
import './style/main.scss';
import Modal from 'react-modal';
// import reportWebVitals from './reportWebVitals';

Modal.setAppElement('#root');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}> {/* Envuelve App con Provider */}
      <App />
    </Provider>
  </React.StrictMode>
);
