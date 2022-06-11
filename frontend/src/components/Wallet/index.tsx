import React from "react";

import { useEthereumState } from "./../../context/ethereum-context";
import { useTokenState } from "./../../context/token-context";

const Wallet: React.FC = () => {
  const { account } = useEthereumState();
  const { balance, owner } = useTokenState();

  const isOwner = account === owner;

  return(
    <div className="Wallet">
      <div className="Container">
        <div className="Card">
          <p><span className="label">Balance:</span> {balance.toLocaleString('en')}</p>
          <p><span className="label">Is Owner:</span> {isOwner.toString()}</p>
        </div>
      </div>
    </div>
  );
}

export default Wallet;
