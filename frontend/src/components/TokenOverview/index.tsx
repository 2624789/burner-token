import React from "react";

import { useTokenState } from "./../../context/token-context";

import './style.scss';

const TokenOverview: React.FC = () => {
  const { name, symbol, supply, address } = useTokenState();

  return(
    <div className="TokenOverview">
      <div className="Container">
        <div className="Card">
          <p><span className="fixed-text">Name:</span> {name}</p>
          <p><span className="fixed-text">Symbol:</span> {symbol}</p>
          <p><span className="fixed-text">Supply:</span> {supply.toLocaleString('en')}</p>
          <p><span className="fixed-text">Address:</span> {address}</p>
        </div>
      </div>
    </div>
  );
}

export default TokenOverview;
