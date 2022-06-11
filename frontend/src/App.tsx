import React from 'react';

import NavBar from './components/NavBar';
import NoWalletMessage from './components/NoWalletMessage';
import { useEthereumState } from "./context/ethereum-context";

const App: React.FC = () => {
  const { provider } = useEthereumState();

  if (!provider) return <NoWalletMessage />;

  return(
    <div className="App">
      <NavBar />
    </div>
  );
}

export default App;
