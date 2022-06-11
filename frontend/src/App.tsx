import React from 'react';

import NavBar from './components/NavBar';
import NoWalletMessage from './components/NoWalletMessage';
import TokenOverview from './components/TokenOverview';
import { useEthereumState } from "./context/ethereum-context";

const App: React.FC = () => {
  const { provider } = useEthereumState();

  if (!provider) return <NoWalletMessage />;

  return(
    <div className="App">
      <NavBar />
      <TokenOverview />
    </div>
  );
}

export default App;
