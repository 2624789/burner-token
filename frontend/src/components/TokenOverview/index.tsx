import React from "react";

import { useTokenState } from "./../../context/token-context";

import './style.scss';

const TokenOverview: React.FC = () => {
  const { name, symbol, supply, address, owner, presale } = useTokenState();

  return(
    <div className="TokenOverview">
      <div className="Container">
        <div className="Card">
          <p><span className="label">Name:</span> {name}</p>
          <p><span className="label">Symbol:</span> {symbol}</p>
          <p><span className="label">Supply:</span> {supply.toLocaleString('en')}</p>
          <p><span className="label">Address:</span> {address}</p>
          <p><span className="label">Owner:</span> {owner}</p>
          <p><span className="label">Presale:</span> {presale?.toString()}</p>
        </div>
      </div>
    </div>
  );
}

export default TokenOverview;
