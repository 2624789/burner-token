import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { EthereumContextProvider } from "./context/ethereum-context";
import { TokenContextProvider } from "./context/token-context";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <EthereumContextProvider>
      <TokenContextProvider>
        <App />
      </TokenContextProvider>
    </EthereumContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
