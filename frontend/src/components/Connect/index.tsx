import React from "react";

import { useEthereum } from './../../context/ethereum-context';

import './style.scss';

const Connect: React.FC = () => {
  const { connect, state } = useEthereum();
  const { account, chain } = state;

  const renderAccount = () => {
    return account === "" 
      ? <button type="button" onClick={connect}>Connect</button>
      : <p>{account.substring(0, 5) + "..." 
          + account.substring(account.length - 4)}</p>
  }

  return(
    <div className="Connect">
      <div className="account">
        {renderAccount()}
      </div>
      <div className="chain-text">
       <p>{chain}</p>
      </div>
    </div>
  );
}

export default Connect;
