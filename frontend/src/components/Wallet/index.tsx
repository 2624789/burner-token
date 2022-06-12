import React from "react";

import { useEthereumState } from "./../../context/ethereum-context";
import { useTokenState } from "./../../context/token-context";

import OwnerControls from './../OwnerControls';

const Wallet: React.FC = () => {
  const { account } = useEthereumState();
  const { balance, owner } = useTokenState();

  const isOwner = account === owner;

  return(
    <div className="Wallet">
      <div className="Container">
        <div className="Card">
          <p>
            <span className="label">Balance:</span>
            {' '}{balance.toLocaleString('en')}
          </p>
          {isOwner ? <OwnerControls /> : null}
        </div>
      </div>
    </div>
  );
}

export default Wallet;
